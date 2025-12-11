from fastapi import APIRouter, HTTPException, Query, File, UploadFile
from dataclasses import dataclass
import requests 
from pdfminer.high_level import extract_text
import tempfile
import asyncio
from concurrent.futures import ThreadPoolExecutor
import os

import config

router = APIRouter()

@dataclass
class QuerySentence:
    query: str
    limit: int = 10


def chunk_text(text: str, max_len: int = config.MAX_CHUNK_LEN):
    text = text.strip()
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + max_len, len(text))
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start = end
    return chunks


async def extract_pdf_text_async(file_bytes: bytes) -> str:
    loop = asyncio.get_event_loop()

    def _extract():
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp_path = tmp.name
            tmp.write(file_bytes)

        try:
            return extract_text(tmp_path)
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    return await loop.run_in_executor(ThreadPoolExecutor(), _extract)


@router.post('/search')
async def with_sentence(body: QuerySentence):
    response = requests.post(config.API_PREDICT, json={
        "query": body.query,
        "limit": body.limit
    })
    
    if not response.ok: return HTTPException(status_code=404, detail="Fetch API Predict Failed")
    
    res = [] 
    for d in response.json():
        res.append({
            "id": d["id"],
            "url_abs": d["link"],
            "url_pdf": d["link"],
            "relevanceScore": d["score"],
            "title": d["headline"],
            "abstract": d["short_description"],
            "publicationDate": d["date"],
            "category": d["category"],
            "authors": d["authors"], 
        })
    
    return res


@router.post('/search-by-file')
async def with_file(
    limit: int,
    file: UploadFile = File(...),
):
    filename = file.filename.lower()
    if not filename.endswith(".pdf"):
        raise HTTPException(status_code=400,detail="File extension must be .pdf")

    file_bytes: bytes = await file.read()
    pdf_text = await extract_pdf_text_async(file_bytes)
    
    if not pdf_text.strip():
        raise HTTPException(status_code=400, detail="PDF contains no extractable text")

    chunks = chunk_text(pdf_text)

    res = await with_sentence(QuerySentence(chunks[0], limit))
    
    return res
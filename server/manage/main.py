from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import search


app = FastAPI(title="Search Management") 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(search.router)
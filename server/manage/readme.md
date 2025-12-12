# API Documentation — `server/manage`

This service is responsible for receiving search queries (text or PDF upload), extracting content when necessary, and calling the prediction API (predictor) to return a list of normalized results.

**Overview**
- **Framework**: FastAPI
- **Purpose**: Provides a search API based on search queries or uploaded files (e.g., content extraction and similarity search).
- **Run server** (in `server/manage` directory):
```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

Default Base URL when running locally: `http://localhost:8001`

----

**APIs**

The router is included in `main.py` (without a prefix), so the endpoints are root paths as shown below.

1) POST `/search`
	- **Purpose**: Search by query (text) and return a list of results.
	- **Request body**: JSON body with the corresponding shape:
        ```json
        {
            "query": string, 
            "limit": int
        }
        ```
	- **Response**: JSON array, where each element is an object containing `id`, `title`, `abstract`, `update_date`, `url_abs`, `url_pdf`.
	- **Response example (pseudo-code)**:
		```json
		[
			{
				"id": "1",
				"title": "Calculation of prompt diphoton production cross sections at Tevatron and LHC energies",
				"abstract": "A fully differential calculation...",
				"update_date": "2008-11-26",
				"url_abs": "https://....",
				"url_pdf": "https://...."
			},
			...
		]
		```

2) POST `/search-by-file`
	- **Purpose**: Search based on uploaded file content (e.g., upload PDF/TXT, extract content, and find similarities).
	- **Parameters**:
		- `limit` (required query param): desired number of results (type `int`).
		- `file` (form-data, required): uploaded file, uses `multipart/form-data`.

	- **Response example**: Similar to the `/search` endpoint (array of result objects).
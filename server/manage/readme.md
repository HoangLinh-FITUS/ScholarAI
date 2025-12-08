
# API Documentation — `server/manage`

Tài liệu này mô tả các endpoint của microservice tìm kiếm (Search Management) viết bằng FastAPI.

**Tổng quan**
- **Framework**: FastAPI
- **Mục đích**: cung cấp API tìm kiếm theo câu truy vấn hoặc theo file upload (ví dụ: trích xuất nội dung và tìm tương đồng).
- **Chạy server** (ở `server/manage`):
```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

Base URL mặc định khi chạy local: `http://localhost:8001`

----

**APIs**

Router được include trong `main.py` (không có prefix), do đó endpoints là root paths như bên dưới.

1) POST `/search`
	- Mục đích: Tìm kiếm theo câu truy vấn (text) và trả về danh sách kết quả mẫu.
	- Request body: JSON body có shape tương ứng: 
        ```json
        {
            "query": string, 
            "limit": int
        }
        ```
	- Response: mảng JSON, mỗi phần tử là object chứa `id`, `title`, `abstract`, `update_date`, `url_abs`, `url_pdf`.
	- Ví dụ response (mã giả):
		```json
		[
			{
				"id": "0704.0001",
				"title": "Calculation of prompt diphoton production cross sections at Tevatron and LHC energies",
				"abstract": "A fully differential calculation...",
				"update_date": "2008-11-26",
				"url_abs": "https://arxiv.org/abs/0704.0001",
				"url_pdf": "https://arxiv.org/pdf/0704.0001"
			},
			...
		]
		```

2) POST `/search-by-file`
	- Mục đích: Tìm kiếm dựa trên nội dung file upload (ví dụ: tải lên PDF/TXT, trích nội dung và tìm tương đồng).
	- Tham số:
		- `limit` (required query param): số kết quả mong muốn (kiểu `int`).
		- `file` (form-data, required): file upload, dùng `multipart/form-data`.

	- Ví dụ response: tương tự endpoint `/search` (mảng object kết quả)
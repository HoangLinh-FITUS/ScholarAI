
# API Documentation — `server/users`

**Tổng quan**
- **Framework**: FastAPI
- **Authentication / Auth backend**: Firebase Admin SDK (service account) + Firebase Identity REST API (để login)
- **Firestore**: lưu thông tin user trong collection `users`
- **Env / config**:
	- `API_KEY_FIREBASE` — API key cho Firebase Identity REST API (dùng cho login)
	- `serviceAccountKey.json` — credentials cho Firebase Admin SDK (đường dẫn được cấu hình trong `config.py`)

Chạy server (ở thư mục `server/users`):
```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Base URL mặc định (khi chạy local với uvicorn): `http://localhost:8000`

----

**APIs**

1) Auth Router (prefix: `/auth`)

- POST `/auth/register`
	- Mục đích: Tạo user mới trong Firebase Auth, lưu metadata vào Firestore và trả link verify email.
	- ghi chú: <uid> là (user id)
	- Body (JSON):
		```json
		{
			"email": "user@example.com",
			"password": "string",
			"role": "string",
			"full_name": "string",
			"phone": "string"
		}
		```

	- Success Response (200):
		```json
		{
			"uid": "<uid>", 
			"verification_link": "<email verification link>"
		}
		```
	- Lỗi phổ biến:
		- 400: `ValueError`, `EmailAlreadyExistsError` hoặc lỗi chung khác.


- GET `/auth/login`
	- Mục đích: Đăng nhập bằng email/password thông qua Firebase Identity REST API (returns tokens).
	- Tham số (query): `email` (string), `password` (string)
	- Hành vi: gọi endpoint `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY_FIREBASE}`
	- Success Response (200): trả nguyên response JSON từ Firebase gồm `idToken`, `refreshToken`, `expiresIn`, `localId` (user id), ...
	- Lỗi: trả 400 với detail `login failed` nếu Firebase trả lỗi.


- POST `/auth/reset_password`
	- Mục đích: Tạo link reset password cho email.
	- Tham số: `email` (hiện hàm định nghĩa `email: str` — FastAPI sẽ nhận từ query param cho POST nếu không dùng Body annotation)
	- Hành vi: `auth.generate_password_reset_link(email=email)`
	- Success Response (200):
		```json
		{ "link_reset": "<reset link>" }
		```
	- Lỗi:
		- 404: `UnexpectedResponseError` -> "User not found"
		- 500: lỗi Firebase khác


1) Users Router (prefix: `/users`)

- DELETE `/users/`
	- Mục đích: Xóa user (Auth + Firestore) theo email
	- Tham số (query): `email` (string)
	- Hành vi: `auth.get_user_by_email` -> `auth.delete_user(uid)` -> `db.collection('users').document(uid).delete()`
	- Success Response (200):
		```json
		{ "uid": "<uid>", "success": "true" }
		```
	- Lỗi: 400 nếu có exception (ValueError hoặc chung)


- GET `/users/`
	- Mục đích: Lấy thông tin user (Auth + DB) theo email
	- Tham số (query): `email` (string)
	- Hành vi: `auth.get_user_by_email(email)` -> đọc document Firestore `users/{uid}`
	- Success Response (200):
		```json
		{
			"auth_user": { /* raw user._data từ firebase_admin */ },
			"db_user": { /* document fields từ Firestore */ }
		}
		```
	- Lỗi: 404 nếu user không tìm thấy hoặc document không tồn tại


- GET `/users/users`
	- Mục đích: Liệt kê users (pagination) từ Firebase Auth
	- Tham số (query):
		- `page_token` (string, optional): token cho trang tiếp theo (mặc định None cho trang đầu)
		- `max_results` (int, default=100, 1-1000): số user tối đa/trang
	- Hành vi: `auth.list_users(page_token=..., max_results=...)` — trả về `page.users` và `page.next_page_token`. Implementation hiện tại gọi `get_user(user.email)` cho mỗi user (tức sẽ gọi lại endpoint get_user để lấy info DB + auth raw data).
	- Success Response (200):
		```json
		{
			"users": [ /* mảng user objects từ get_user(...) */ ],
			"next_page_token": "<token or null>"
		}
		```
	- Lỗi: 400 cho exception chung




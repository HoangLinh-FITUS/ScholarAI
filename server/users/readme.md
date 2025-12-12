# API Documentation — `server/users`

**Overview**
- **Framework**: FastAPI
- **Authentication / Auth backend**: Firebase Admin SDK (service account) + Firebase Identity REST API (for login)
- **Firestore**: Stores user information in the `users` collection
- **Env / config**:
	- `API_KEY_FIREBASE` — API key for Firebase Identity REST API (used for login)
	- `serviceAccountKey.json` — Credentials for the Firebase Admin SDK (path configured in `config.py`)

Run server (in `server/users` directory):
```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Default Base URL (when running locally with uvicorn): `http://localhost:8000`

----

**APIs**

1) Auth Router (prefix: `/auth`)

- POST `/auth/register`
	- **Purpose**: Create a new user in Firebase Auth, save metadata to Firestore, and return an email verification link.
	- **Note**: `<uid>` is the user ID.
	- **Body (JSON)**:
		```json
		{
			"email": "user@example.com",
			"password": "string",
			"role": "string",
			"full_name": "string",
			"phone": "string"
		}
		```

	- **Success Response (200)**:
		```json
		{
			"uid": "<uid>", 
			"verification_link": "<email verification link>"
		}
		```
	- **Common Errors**:
		- 400: `ValueError`, `EmailAlreadyExistsError`, or other general errors.


- GET `/auth/login`
	- **Purpose**: Log in using email/password via Firebase Identity REST API (returns tokens).
	- **Parameters (query)**: `email` (string), `password` (string)
	- **Behavior**: Calls endpoint `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY_FIREBASE}`
	- **Success Response (200)**: Returns the raw JSON response from Firebase including `idToken`, `refreshToken`, `expiresIn`, `localId` (user id), etc.
	- **Error**: Returns 400 with detail `login failed` if Firebase returns an error.


- POST `/auth/reset_password`
	- **Purpose**: Generate a password reset link for an email.
	- **Parameters**: `email` (currently defined as `email: str` — FastAPI will receive this from a query param for POST if no Body annotation is used).
	- **Behavior**: `auth.generate_password_reset_link(email=email)`
	- **Success Response (200)**:
		```json
		{ "link_reset": "<reset link>" }
		```
	- **Error**:
		- 404: `UnexpectedResponseError` -> "User not found"
		- 500: Other Firebase errors


2) Users Router (prefix: `/users`)

- DELETE `/users/`
	- **Purpose**: Delete a user (Auth + Firestore) by email.
	- **Parameters (query)**: `email` (string)
	- **Behavior**: `auth.get_user_by_email` -> `auth.delete_user(uid)` -> `db.collection('users').document(uid).delete()`
	- **Success Response (200)**:
		```json
		{ "uid": "<uid>", "success": "true" }
		```
	- **Error**: 400 if an exception occurs (ValueError or general).


- GET `/users/`
	- **Purpose**: Retrieve user information (Auth + DB) by email.
	- **Parameters (query)**: `email` (string)
	- **Behavior**: `auth.get_user_by_email(email)` -> reads Firestore document `users/{uid}`
	- **Success Response (200)**:
		```json
		{
			"auth_user": { /* raw user._data from firebase_admin */ },
			"db_user": { /* document fields from Firestore */ }
		}
		```
	- **Error**: 404 if user is not found or document does not exist.


- GET `/users/users`
	- **Purpose**: List users (pagination) from Firebase Auth.
	- **Parameters (query)**:
		- `page_token` (string, optional): Token for the next page (default is None for the first page).
		- `max_results` (int, default=100, 1-1000): Max users per page.
	- **Behavior**: `auth.list_users(page_token=..., max_results=...)` — returns `page.users` and `page.next_page_token`. Current implementation calls `get_user(user.email)` for each user (meaning it will recall the get_user endpoint to fetch DB info + auth raw data).
	- **Success Response (200)**:
		```json
		{
			"users": [ /* array of user objects from get_user(...) */ ],
			"next_page_token": "<token or null>"
		}
		```
	- **Error**: 400 for general exceptions.
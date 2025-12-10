import requests
import firebase_admin
from firebase_admin import auth
from fastapi import HTTPException, APIRouter, Header

from firebase_init import db
from models.auth import SignIn, Login
from config import API_KEY_FIREBASE


router = APIRouter()

@router.post('/register')
async def register(user: SignIn) -> dict:
    try:
        user_auth: auth.UserRecord = auth.create_user(email=user.email, password=user.password)
        link = auth.generate_email_verification_link(email=user.email)

        db.collection("users").document(user_auth.uid).set({
            "email": user.email,
            "uid": user_auth.uid,
            "role": user.role,
            "full_name": user.full_name,
            "phone": user.phone
        })

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except firebase_admin._auth_utils.EmailAlreadyExistsError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


    return {
        "uid": user_auth.uid,
        "verification_link": link
    }  


@router.post('/login')
async def login_user(user: Login) -> dict:
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY_FIREBASE}"
    payload = {
        "email": user.email,
        "password": user.password,
        "returnSecureToken": True
    }
    res = requests.post(url, json=payload)
    
    if res.status_code == 200: return res.json()
    raise HTTPException(status_code=400, detail='login failed') 

@router.post("/logout")
async def logout(authorization: str = Header(...)):
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header")

        id_token = authorization.split(" ")[1]

        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token["uid"]

        auth.revoke_refresh_tokens(uid)

        return {
            "message": "Logout successful"
        }

    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/reset_password')
async def reset_password(email: str) -> dict: 
    try:
        link = auth.generate_password_reset_link(email=email)
    except firebase_admin._auth_utils.UnexpectedResponseError:
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Firebase error: {e}")

    return {
        "link_reset": link 
    }


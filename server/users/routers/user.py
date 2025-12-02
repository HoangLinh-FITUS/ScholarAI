from fastapi import APIRouter, HTTPException, Query
from firebase_admin import auth

from firebase_init import db


router = APIRouter()


@router.delete('/')
async def delete_user(email: str) -> dict:
    try:
        user: auth.UserRecord = auth.get_user_by_email(email=email)
        auth.delete_user(uid=user.uid)
        db.collection("users").document(user.uid).delete()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "uid": user.uid,
        "sucess": "true"
    }


@router.get('/')
def get_user(email: str) -> dict:
    try:
        user: auth.UserRecord = auth.get_user_by_email(email=email)
        data = db.collection("users").document(user.uid).get()
        if not data.exists:
            raise Exception("uid not exist in users table")
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
    else:
        data = data.to_dict()

    return {
        "auth_user": user._data,
        "db_user": data
    }


@router.get("/users")
def get_users(
    page_token: str = Query(default=None, description="Token trang trước để lấy trang tiếp theo (trang 1 co page_token = None)"),
    max_results: int = Query(default=100, gt=0, le=1000, description="Số user tối đa mỗi trang (1-1000)")
) -> dict:
    try:
        page = auth.list_users(page_token=page_token, max_results=max_results)
        users = [get_user(user.email) for user in page.users]

        return {
            "users": users,
            "next_page_token": page.next_page_token  
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from app.core.firebase import verify_id_token  # Make sure import matches your file structure
from firebase_admin import firestore

app = FastAPI()
db = firestore.client()
class TokenRequest(BaseModel):
    id_token: str

@app.post("/auth/google")
def google_auth(request: TokenRequest):
    user_data = verify_id_token(request.id_token)

    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid ID token")

    user_id = user_data.get("uid")
    email = user_data.get("email")
    name = user_data.get("name")
    picture = user_data.get("picture")

    # Optional: Check if the user already exists
    user_ref = db.collection('users').document(user_id)
    user_snapshot = user_ref.get()

    if not user_snapshot.exists:
        # Create a new user document
        user_ref.set({
            'email': email,
            'name': name,
            'picture': picture,
            'created_at': firestore.SERVER_TIMESTAMP
        })

    return {
        "message": "User authenticated and profile synced!",
        "user": {
            "uid": user_id,
            "email": email,
            "name": name,
            "picture": picture
        }
    }
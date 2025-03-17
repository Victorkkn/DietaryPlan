from fastapi import APIRouter, Depends, Header, HTTPException
from app.core.firebase import verify_firebase_token, db
from app.services.diet_generator import calculate_bmr, calculate_tdee, adjust_calories, calculate_macros

router = APIRouter()

@router.post("/generate")
async def generate_diet_plan(
    weight: float,
    height: float,
    age: int,
    gender: str,
    activity_level: str,
    goal: str,
    authorization: str = Header(None)
):
    # Check if Authorization header is present
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    # Extract token from header (Authorization: Bearer <token>)
    id_token = authorization.split(" ")[1]
    
    # Verify Firebase token
    user = verify_firebase_token(id_token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")
    
    # Run diet calculations
    bmr = calculate_bmr(weight, height, age, gender)
    tdee = calculate_tdee(bmr, activity_level)
    calories = adjust_calories(tdee, goal)
    macros = calculate_macros(calories, goal)

    diet_plan = {
        "bmr": bmr,
        "tdee": tdee,
        "calories": calories,
        "macros": macros
    }

    # Store diet plan in Firestore under user's UID
    user_ref = db.collection("users").document(user["uid"])
    user_ref.set({"latest_diet_plan": diet_plan}, merge=True)

    return {
        "message": "Diet plan generated successfully",
        "diet_plan": diet_plan
    }

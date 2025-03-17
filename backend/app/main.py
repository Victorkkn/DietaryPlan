from fastapi import FastAPI
from app.api.v1.endpoints import diet_plans

app = FastAPI(title="DietaryPlan API with Firebase")

app.include_router(diet_plans.router, prefix="/api/v1/diet")

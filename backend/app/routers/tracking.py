from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from datetime import datetime

from .. import schemas, dependencies
from ..db import get_database
from ..models import ProductClick as ProductClickModel

router = APIRouter()

@router.post("/click", status_code=status.HTTP_201_CREATED)
async def track_product_click(
    click_data: schemas.ProductClickCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    click_doc = click_data.dict()
    click_doc["timestamp"] = datetime.utcnow()
    await db["product_clicks"].insert_one(click_doc)
    return {"message": "Product click tracked successfully"}

@router.get("/clicks", response_model=List[ProductClickModel])
async def get_tracked_clicks(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: schemas.User = Depends(dependencies.get_current_admin_user)
):
    clicks = await db["product_clicks"].find().sort("timestamp", -1).to_list(1000)
    return clicks
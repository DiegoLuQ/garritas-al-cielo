from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from bson import ObjectId

from .. import schemas, dependencies
from ..db import get_database
from ..models import Product as ProductModel

router = APIRouter()

@router.get("/", response_model=List[ProductModel])
async def get_products(db: AsyncIOMotorDatabase = Depends(get_database)):
    products = await db["products"].find().to_list(100)
    return products

@router.get("/{id}", response_model=ProductModel)
async def get_product_by_id(id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    product = await db["products"].find_one({"_id": ObjectId(id)})
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=ProductModel, status_code=status.HTTP_201_CREATED)
async def create_product(
    product: schemas.ProductCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: schemas.User = Depends(dependencies.get_current_admin_user)
):
    product_dict = product.dict()
    result = await db["products"].insert_one(product_dict)
    created_product = await db["products"].find_one({"_id": result.inserted_id})
    return created_product

@router.put("/{id}", response_model=ProductModel)
async def update_product(
    id: str,
    product: schemas.ProductUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: schemas.User = Depends(dependencies.get_current_admin_user)
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid product ID")

    update_data = {k: v for k, v in product.dict().items() if v is not None}

    if len(update_data) >= 1:
        result = await db["products"].update_one(
            {"_id": ObjectId(id)}, {"$set": update_data}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")

    updated_product = await db["products"].find_one({"_id": ObjectId(id)})
    if updated_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated_product

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: schemas.User = Depends(dependencies.get_current_admin_user)
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid product ID")

    result = await db["products"].delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return
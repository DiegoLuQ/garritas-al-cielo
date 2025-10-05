from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from .. import schemas, dependencies
from ..db import get_database
from ..models import SiteConfig as SiteConfigModel

router = APIRouter()

@router.get("/", response_model=SiteConfigModel)
async def get_site_config(db: AsyncIOMotorDatabase = Depends(get_database)):
    config = await db["site_config"].find_one()
    if config is None:
        raise HTTPException(status_code=404, detail="Site configuration not found.")
    return config

@router.put("/", response_model=SiteConfigModel)
async def update_site_config(
    config_update: schemas.SiteConfigUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: schemas.User = Depends(dependencies.get_current_admin_user)
):
    config = await db["site_config"].find_one()
    if config is None:
        raise HTTPException(status_code=404, detail="Site configuration not found.")

    update_data = config_update.dict()
    await db["site_config"].update_one(
        {"_id": config["_id"]},
        {"$set": update_data}
    )

    updated_config = await db["site_config"].find_one({"_id": config["_id"]})
    return updated_config
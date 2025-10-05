import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from app.routers import auth, products, site_config, tracking
from app.db import get_database
from app.security import get_password_hash

app = FastAPI(
    title="E-commerce API",
    description="Backend for the Next.js E-commerce application.",
    version="0.1.0"
)

# CORS (Cross-Origin Resource Sharing)
origins = [
    "http://localhost",
    "http://localhost:3000",
    # Add the production frontend URL here if available
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    app.mongodb = get_database()

    # Create a default admin user if one doesn't exist
    admin_user = await app.mongodb["users"].find_one({"username": "admin"})
    if not admin_user:
        await app.mongodb["users"].insert_one({
            "username": "admin",
            "hashed_password": get_password_hash("admin"),
            "role": "admin"
        })

    # Create default site config if it doesn't exist
    config = await app.mongodb["site_config"].find_one()
    if not config:
        await app.mongodb["site_config"].insert_one({
            "mainH1": "Tecnología de Vanguardia",
            "mainParagraph": "Explora nuestra selección de productos de alta tecnología.",
            "contactData": "contacto@eshop.com",
            "whatsappNumber": "+56912345678"
        })


@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the E-commerce API"}

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/productos", tags=["Products"])
app.include_router(site_config.router, prefix="/configuracion", tags=["Site Configuration"])
app.include_router(tracking.router, prefix="/tracking", tags=["Tracking"])


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
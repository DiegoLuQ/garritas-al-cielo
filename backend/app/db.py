import motor.motor_asyncio
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("No DATABASE_URL environment variable set")

client = motor.motor_asyncio.AsyncIOMotorClient(DATABASE_URL)
database = client.get_database("ecommerce") # You can change the database name here

def get_database():
    return database
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# --- Product Schemas ---
class ProductBase(BaseModel):
    codigo: str
    imagenes: List[str]
    nombre: Optional[str] = None
    descripcion: str
    precio: float
    valoracion: float
    etiquetas: List[str]
    descuento: Optional[float] = 0
    disponible: bool

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    codigo: Optional[str] = None
    imagenes: Optional[List[str]] = None
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio: Optional[float] = None
    valoracion: Optional[float] = None
    etiquetas: Optional[List[str]] = None
    descuento: Optional[float] = None
    disponible: Optional[bool] = None

class ProductInDB(ProductBase):
    id: str

# --- SiteConfig Schemas ---
class SiteConfigBase(BaseModel):
    mainH1: str
    mainParagraph: str
    contactData: str
    whatsappNumber: str

class SiteConfigUpdate(SiteConfigBase):
    pass

# --- User Schemas ---
class User(BaseModel):
    username: str
    role: str

class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class TokenData(BaseModel):
    username: Optional[str] = None

# --- ProductClick Schemas ---
class ProductClickCreate(BaseModel):
    productCode: str
    productName: str
    description: str
    price: float

class ProductClickInDB(ProductClickCreate):
    id: str
    timestamp: datetime
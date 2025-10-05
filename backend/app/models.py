from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        return {"type": "string"}

class Product(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    codigo: str
    imagenes: List[str]
    nombre: Optional[str] = None
    descripcion: str
    precio: float
    valoracion: float
    etiquetas: List[str]
    descuento: Optional[float] = 0
    disponible: bool

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
        json_schema_extra={
            "example": {
                "nombre": "Teclado Mecánico RGB",
                "codigo": "TEC-001",
                "descripcion": "Un teclado mecánico con iluminación RGB.",
                "precio": 89.99,
                "valoracion": 5,
                "imagenes": [],
                "disponible": True,
                "etiquetas": ["gaming", "periferico"],
                "descuento": 10,
            }
        },
    )

class SiteConfig(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    mainH1: str
    mainParagraph: str
    contactData: str
    whatsappNumber: str

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
        json_schema_extra={
            "example": {
                "mainH1": "Tecnología de Vanguardia",
                "mainParagraph": "Explora nuestra selección de productos.",
                "contactData": "contacto@eshop.com",
                "whatsappNumber": "+56912345678",
            }
        },
    )

class UserInDB(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: str
    hashed_password: str
    role: str = "user"

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )

class ProductClick(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    productCode: str
    productName: str
    description: str
    price: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )
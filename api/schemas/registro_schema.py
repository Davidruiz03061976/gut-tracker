"""
Schema de validación para crear/actualizar registros.
Equivalente conceptual a Zod en JS: define la forma de los datos y valida.
"""
from pydantic import BaseModel, Field


class RegistroCreateSchema(BaseModel):
    """Payload válido para POST /api/registros."""

    comida: str = Field(..., min_length=1, max_length=10_000)
    urgencia: int = Field(default=0, ge=0, le=10)
    dolor: int = Field(default=0, ge=0, le=10)
    hinchazon: int = Field(default=0, ge=0, le=10)
    bristol: int = Field(default=3, ge=1, le=7)  # Escala de Bristol 1-7

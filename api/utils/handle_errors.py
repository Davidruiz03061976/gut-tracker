"""
Sistema centralizado de manejo de errores para el backend.
Registra handlers en la app Flask y define excepciones reutilizables.
"""
from flask import Flask, jsonify

from pydantic import ValidationError as PydanticValidationError


# --- Excepciones reutilizables ---

class AppError(Exception):
    """Error base de la aplicación con código HTTP y mensaje."""

    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class NotFoundError(AppError):
    """Recurso no encontrado (404)."""

    def __init__(self, message: str = "Recurso no encontrado"):
        super().__init__(message=message, status_code=404)


class BadRequestError(AppError):
    """Petición inválida (400)."""

    def __init__(self, message: str = "Petición inválida"):
        super().__init__(message=message, status_code=400)


# --- Formato de respuesta de error ---

def error_response(message: str, status_code: int, details: list | dict | None = None):
    """Respuesta JSON estándar para errores."""
    body = {"error": message}
    if details is not None:
        body["details"] = details
    return jsonify(body), status_code


# --- Handlers de excepciones ---

def _handle_pydantic_validation(error: PydanticValidationError):
    """Convierte errores de Pydantic a formato JSON legible."""
    details = [
        {"field": ".".join(str(loc) for loc in e["loc"]), "msg": e["msg"]}
        for e in error.errors()
    ]
    return error_response("Error de validación", 422, details=details)


def _handle_app_error(error: AppError):
    return error_response(error.message, error.status_code)


def _handle_404(error):
    return error_response("Ruta no encontrada", 404)


def _handle_500(error):
    return error_response("Error interno del servidor", 500)


def register_error_handlers(app: Flask) -> None:
    """
    Registra todos los manejadores de errores en la app.
    Llamar una vez tras crear la app (ej. en app.py).
    """
    app.register_error_handler(PydanticValidationError, _handle_pydantic_validation)
    app.register_error_handler(AppError, _handle_app_error)
    app.register_error_handler(404, _handle_404)
    app.register_error_handler(500, _handle_500)

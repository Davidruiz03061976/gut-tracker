"""
Rutas bajo el prefijo /api.
Las rutas se definen sin /api; el blueprint se registra con url_prefix="/api".
"""
from flask import Blueprint, jsonify, request

from models import Registro, db
from schemas.registro_schema import RegistroCreateSchema
from utils.handle_errors import BadRequestError, NotFoundError

api_bp = Blueprint("api", __name__)


@api_bp.get("/health")
def health():
    return jsonify({"status": "Backend funcionando correctamente"})


# --- Registros ---

@api_bp.get("/registros")
def listar_registros():
    registros = Registro.query.all()
    return jsonify([registro.to_dict() for registro in registros])


@api_bp.get("/registros/<int:id>")
def obtener_registro(id: int):
    registro = Registro.query.get(id)
    if not registro:
        raise NotFoundError("Registro no encontrado")
    return jsonify(registro.to_dict())


@api_bp.post("/registros")
def crear_registro():
    data = request.get_json()
    if not data:
        raise BadRequestError("El cuerpo de la petición debe ser JSON")

    payload = RegistroCreateSchema.model_validate(data)
    nuevo = Registro(
        comida=payload.comida,
        urgencia=payload.urgencia,
        dolor=payload.dolor,
        hinchazon=payload.hinchazon,
        bristol=payload.bristol,
    )
    db.session.add(nuevo)
    db.session.commit()
    return jsonify(nuevo.to_dict()), 201


@api_bp.delete("/registros")
def borrar_todo():
    Registro.query.delete()
    db.session.commit()
    return jsonify({"message": "Todos los registros han sido eliminados"})

"""
Rutas bajo el prefijo /api.
Las rutas se definen sin /api; el blueprint se registra con url_prefix="/api".
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..models import Registro, db
from ..schemas.registro_schema import RegistroCreateSchema
from ..utils.handle_errors import BadRequestError, NotFoundError

api_bp = Blueprint("api", __name__)


@api_bp.get("/health")
def health():
    return jsonify({"status": "Backend funcionando correctamente"}), 200


@api_bp.get("/registros")
@jwt_required()
def listar_registros():
    user_id = int(get_jwt_identity())

    registros = (
        Registro.query
        .filter_by(user_id=user_id)
        .order_by(Registro.fecha.desc())
        .all()
    )

    return jsonify([registro.to_dict() for registro in registros]), 200


@api_bp.get("/registros/<int:id>")
@jwt_required()
def obtener_registro(id: int):
    user_id = int(get_jwt_identity())

    registro = Registro.query.filter_by(id=id, user_id=user_id).first()

    if not registro:
        raise NotFoundError("Registro no encontrado")

    return jsonify(registro.to_dict()), 200


@api_bp.post("/registros")
@jwt_required()
def crear_registro():
    data = request.get_json(silent=True)
    if not data:
        raise BadRequestError("El cuerpo de la petición debe ser JSON")

    user_id = int(get_jwt_identity())
    payload = RegistroCreateSchema.model_validate(data)

    nuevo = Registro(
        user_id=user_id,
        comida=payload.comida,
        urgencia=payload.urgencia,
        dolor=payload.dolor,
        hinchazon=payload.hinchazon,
        bristol=payload.bristol,
    )

    db.session.add(nuevo)
    db.session.commit()

    return jsonify(nuevo.to_dict()), 201


@api_bp.delete("/registros/<int:id>")
@jwt_required()
def borrar_registro(id: int):
    user_id = int(get_jwt_identity())

    registro = Registro.query.filter_by(id=id, user_id=user_id).first()

    if not registro:
        raise NotFoundError("Registro no encontrado")

    db.session.delete(registro)
    db.session.commit()

    return jsonify({"message": "Registro eliminado correctamente"}), 200
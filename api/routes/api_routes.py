"""
Rutas bajo el prefijo /api.
Las rutas se definen sin /api; el blueprint se registra con url_prefix="/api".
"""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Registro, User, db
from schemas.registro_schema import RegistroCreateSchema
from utils.handle_errors import BadRequestError, NotFoundError

api_bp = Blueprint("api", __name__)


@api_bp.get("/health")
def health():
    return jsonify({"status": "Backend funcionando correctamente"})


@api_bp.get("/registros")
@jwt_required()
def listar_registros():
    user_id = int(get_jwt_identity())

    registros = Registro.query.filter_by(user_id=user_id).all()

    return [registro.to_dict() for registro in registros], 200

@api_bp.get("/registros/<int:id>")
def obtener_registro(id: int):
    user_id = request.args.get("user_id", type=int)
    if user_id is None:
        raise BadRequestError("user_id es obligatorio")

    registro = Registro.query.get(id)
    if not registro:
        raise NotFoundError("Registro no encontrado")

    if registro.user_id != user_id:
        raise NotFoundError("Registro no encontrado para este usuario")

    return jsonify(registro.to_dict())

@api_bp.post("/registros")
def crear_registro():
    data = request.get_json()
    if not data:
        raise BadRequestError("El cuerpo de la petición debe ser JSON")

    payload = RegistroCreateSchema.model_validate(data)

    user = User.query.get(payload.user_id)
    if not user:
        raise NotFoundError("Usuario no encontrado")

    nuevo = Registro(
        user_id=payload.user_id,
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
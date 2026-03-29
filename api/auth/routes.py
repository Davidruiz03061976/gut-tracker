from flask import Blueprint, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from ..models import db, User

auth_bp = Blueprint("auth", __name__)


@auth_bp.get("/auth/ping")
def auth_ping():
    return {"msg": "auth ok"}, 200


@auth_bp.post("/auth/register")
def register():
    data = request.get_json() or {}

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return {"error": "Email y password son obligatorios"}, 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return {"error": "Ese email ya está registrado"}, 409

    password_hash = generate_password_hash(password)

    user = User(
        email=email,
        password_hash=password_hash,
    )

    db.session.add(user)
    db.session.commit()

    return {
        "message": "Usuario creado correctamente",
        "user": user.to_dict()
    }, 201


@auth_bp.post("/auth/login")
def login():
    data = request.get_json() or {}

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return {"error": "Email y password son obligatorios"}, 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return {"error": "Credenciales inválidas"}, 401

    if not check_password_hash(user.password_hash, password):
        return {"error": "Credenciales inválidas"}, 401

    access_token = create_access_token(identity=str(user.id))

    return {
        "message": "Login correcto",
        "access_token": access_token,
        "user": user.to_dict()
    }, 200


@auth_bp.get("/auth/me")
@jwt_required()
def me():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user:
        return {"error": "Usuario no encontrado"}, 404

    return {"user": user.to_dict()}, 200
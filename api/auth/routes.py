from flask import Blueprint

auth_bp = Blueprint("auth",__name__)

@auth_bp.get("/auth/ping")
def auth_ping():
    return {"msg": "auth ok"}, 200
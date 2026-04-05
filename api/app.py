from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .config import Config
from .models import db
from .routes.api_routes import api_bp
from .auth.routes import auth_bp
from .utils.handle_errors import register_error_handlers

jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # CORS para el frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Inicializar extensiones
    db.init_app(app)
    jwt.init_app(app)

    # Registrar blueprints
    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")

    # Registrar manejo de errores
    register_error_handlers(app)

    # Crear tablas
    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
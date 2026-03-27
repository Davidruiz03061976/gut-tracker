from flask import Flask
from flask_cors import CORS

from config import Config
from models import db
from routes.api_routes import api_bp
from auth.routes import auth_bp
from utils.handle_errors import register_error_handlers

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Blueprints: prefijo /api para todas las rutas del API
app.register_blueprint(api_bp, url_prefix="/api")
app.register_blueprint(auth_bp)

# Errores centralizados (Pydantic, NotFoundError, 404, 500)
register_error_handlers(app)

db.init_app(app)
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)


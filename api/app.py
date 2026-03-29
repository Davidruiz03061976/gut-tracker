from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .config import Config
from .models import db
from .routes.api_routes import api_bp
from .auth.routes import auth_bp
from .utils.handle_errors import register_error_handlers

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET_KEY
jwt = JWTManager(app)

# Todo bajo /api
app.register_blueprint(api_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api")

register_error_handlers(app)

db.init_app(app)
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
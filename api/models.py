from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    registros = db.relationship("Registro", backref="user", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Registro(db.Model):
    __tablename__ = "registros"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    comida = db.Column(db.Text, nullable=False)
    urgencia = db.Column(db.Integer, nullable=False, default=0)
    dolor = db.Column(db.Integer, nullable=False, default=0)
    hinchazon = db.Column(db.Integer, nullable=False, default=0)
    bristol = db.Column(db.Integer, nullable=False, default=0)
    fecha = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "comida": self.comida,
            "urgencia": self.urgencia,
            "dolor": self.dolor,
            "hinchazon": self.hinchazon,
            "bristol": self.bristol,
            "fecha": self.fecha.isoformat() if self.fecha else None,
        }
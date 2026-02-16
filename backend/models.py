from flask_sqlalchemy import SQLAlchemy
from datetime import datetime # Importa la clase SQLAlchemy para manejar la base de datos y datetime para manejar las fechas

db = SQLAlchemy() # Inicializa la instancia de SQLAlchemy

class Registro(db.Model): # Define el modelo de datos para los registros de comidas y síntomas
    __tablename__ = 'registros' # Nombre de la tabla en la base de datos
    id = db.Column(db.Integer, primary_key=True) 
    comida = db.Column(db.Text, nullable=False)
    urgencia = db.Column(db.Integer, nullable=False, default=0)
    dolor = db.Column(db.Integer, nullable=False, default=0)
    hinchazon = db.Column(db.Integer, nullable=False, default=0)
    bristol = db.Column(db.Integer, nullable=False, default=0)
    fecha = db.Column(db.DateTime, default=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    def to_dict(self):# Método para convertir el objeto Registro a un diccionario, útil para serializar a JSON
        return {
            "id": self.id,
            "comida": self.comida,
            "urgencia": self.urgencia,
            "dolor": self.dolor,
            "hinchazon": self.hinchazon,
            "bristol": self.bristol,
            "fecha": self.fecha
        }
    



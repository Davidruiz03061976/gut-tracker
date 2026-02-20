from auth.routes import auth_bp
from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Registro

from config import Config

app = Flask(__name__)
app.config.from_object(Config)
app.register_blueprint(auth_bp)
CORS(app)

db.init_app(app)
with app.app_context(): # Crea el contexto de la aplicación para crear las tablas en la base de datos
    db.create_all() # Crea las tablas en la base de datos según los modelos definidos



@app.get("/api/health") # Define una ruta GET para verificar la salud de la API
def health():
    return jsonify({"status": "Backend funcionando correctamente"}) 

#1) Ruta para obtener todos los registros
@app.get("/api/registros")
def listar_registros():
    registros = Registro.query.all() # Consulta todos los registros en la base de datos
    return jsonify([registro.to_dict() for registro in registros]) # Devuelve una lista de
    
#2) Ruta para crear un nuevo registro
@app.post("/api/registros")
def crear_registro():
    data = request.get_json() or {}

    comida = data.get("comida")
    if not comida:
        return jsonify({"error": "El campo 'comida' es obligatorio"}), 400

    nuevo = Registro(
        comida=comida,
        urgencia=data.get("urgencia", 0),
        dolor=data.get("dolor", 0),
        hinchazon=data.get("hinchazon", 0),
        bristol=data.get("bristol", 3),
    )

    db.session.add(nuevo)
    db.session.commit()

    return jsonify(nuevo.to_dict()), 201

#3) Ruta para eliminar un registro por ID
@app.delete("/api/registros")
def borrar_todo():
    Registro.query.delete() # Elimina todos los registros de la base de datos
    db.session.commit() # Guarda los cambios en la base de datos después de eliminar los registros
    return jsonify({"message": "Todos los registros han sido eliminados"}) # Devuelve un mensaje indicando que todos los registros han sido eliminados
    
@app.get("/api/registros/<int:id>") # Define una ruta GET para obtener un registro específico por su ID
def obtener_registro(id):
    # Buscar el registro por su ID
    registro = Registro.query.get(id)

    # Si no existe, devolver 404
    if not registro:
        return jsonify({"error": "Registro no encontrado"}), 404
    # Si existe, devolverlo como JSON
    return jsonify(registro.to_dict()), 200


if __name__ == "__main__":
    app.run(debug=True)
from  flask import Flask, jsonify, request # Importa Flask para crear la aplicación web, jsonify para convertir objetos a JSON y request para manejar las solicitudes HTTP
from flask_cors import CORS # Importa CORS para manejar las solicitudes de origen cruzado
from models import db, Registro # Importa la instancia de SQLAlchemy y el modelo de datos Registro
app = Flask(__name__)# Crea una instancia de la aplicación Flask
CORS(app) # Habilita CORS para la aplicación

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///registros.db" # Configura la URI de la base de datos SQLite
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False # Desactiva el seguimiento de modificaciones para mejorar el rendimiento
db.init_app(app)# Inicializa la aplicación con la configuración de la base de datos
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
    if __name__ == "__main__":
        app.run(debug=True)

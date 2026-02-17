import "./App.css";
import { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:5000";
// 👉 URL base de tu backend Flask

// 🔵 0️⃣ ESTADOS PARA EL FORMULARIO Y LOS REGISTROS
function App() {
  const [comida, setComida] = useState("");
  const [urgencia, setUrgencia] = useState(0);
  const [dolor, setDolor] = useState(0);
  const [hinchazon, setHinchazon] = useState(0);
  const [bristol, setBristol] = useState(3);
  const [registros, setRegistros] = useState([]);

  // 🔵 1️⃣ CARGAR REGISTROS DESDE EL BACKEND
  useEffect(() => {
    fetch(`${API_URL}/api/registros`)
      .then((res) => res.json())
      //👉 Guardamos los registros en el estado
      .then((data) => setRegistros(data))
      // 👉 Si hay un error, lo mostramos en consola
      .catch((error) => console.error("Error cargando registros:", error));
    // 👉 El array vacío [] hace que esto solo se ejecute una vez al montar el componente
  }, []);
  // 👉 Se ejecuta solo al iniciar la app

  // 🔵 Convertir número Bristol a texto
  const bristolLabel = (valor) => {
    switch (
      valor // 👉 Según el valor, devolvemos una descripción
    ) {
      case 1:
        return "1 - Muy duro";
      case 2:
        return "2 - Duro";
      case 3:
        return "3 - Normal";
      case 4:
        return "4 - Ideal";
      case 5:
        return "5 - Blando";
      case 6:
        return "6 - Diarrea leve";
      case 7:
        return "7 - Diarrea líquida";
      default:
        return "Desconocido";
    }
  };

  // 🔵 2️⃣ GUARDAR REGISTRO EN BACKEND
  const guardarDia = () => {
    const nuevoRegistro = {
      comida,
      urgencia,
      dolor,
      hinchazon,
      bristol,
    };
    // 👉 Enviamos el nuevo registro al backend con POST
    fetch(`${API_URL}/api/registros`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoRegistro), // 👉 Convertimos el objeto a JSON para enviarlo al backend
    })
      .then((res) => res.json())
      .then((data) => {
        // 👉 Añadimos el nuevo registro al estado
        setRegistros([...registros, data]);
      })
      .catch((error) => console.error("Error guardando:", error));

    // Reset formulario
    setComida("");
    setUrgencia(0);
    setDolor(0);
    setHinchazon(0);
    setBristol(3);
  };

  // 🔵 3️⃣ BORRAR TODOS LOS REGISTROS (DELETE)
  const borrarTodo = () => {
    fetch(`${API_URL}/api/registros`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setRegistros([]);
      })
      .catch((error) => console.error("Error borrando:", error));
  };

  return (
    <div>
      <h1>Registrar Día</h1>

      <textarea
        placeholder="¿Qué has comido?" // 👉 Campo para escribir la comida del día
        value={comida}
        onChange={(e) => setComida(e.target.value)} // 👉 Actualizamos el estado cada vez que el usuario escribe
        rows={4}
      />

      <p>Urgencia: {urgencia}</p>
      <button onClick={() => setUrgencia(Math.min(10, urgencia + 1))}>+</button>
      <button onClick={() => setUrgencia(Math.max(0, urgencia - 1))}>-</button>

      <p>Hinchazón: {hinchazon}</p>
      <button onClick={() => setHinchazon(Math.min(10, hinchazon + 1))}>
        +
      </button>
      <button onClick={() => setHinchazon(Math.max(0, hinchazon - 1))}>
        -
      </button>

      <p>Bristol: {bristolLabel(bristol)}</p>
      <button onClick={() => setBristol(Math.min(7, bristol + 1))}>+</button>
      <button onClick={() => setBristol(Math.max(1, bristol - 1))}>-</button>

      <p>Dolor: {dolor}</p>
      <button onClick={() => setDolor(Math.min(10, dolor + 1))}>+</button>
      <button onClick={() => setDolor(Math.max(0, dolor - 1))}>-</button>

      <br />
      <button onClick={guardarDia}>Guardar día</button>

      <h2>Historial</h2>
      <button onClick={borrarTodo}>Eliminar todo</button>

      {registros.map((registro, index) => (
        <div
          key={index}
          style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}
        >
          <p>Comida: {registro.comida}</p>
          <p>Urgencia: {registro.urgencia}</p>
          <p>Dolor: {registro.dolor}</p>
          <p>Hinchazón: {registro.hinchazon}</p>
          <p>Bristol: {bristolLabel(registro.bristol)}</p>
        </div>
      ))}
    </div>
  );
}

export default App;

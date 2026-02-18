import "./App.css";
import { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:5000";

function App() {
  // Estados del formulario
  const [comida, setComida] = useState("");
  const [urgencia, setUrgencia] = useState(0);
  const [dolor, setDolor] = useState(0);
  const [hinchazon, setHinchazon] = useState(0);
  const [bristol, setBristol] = useState(3);

  // Registros
  const [registros, setRegistros] = useState([]);

  // Cargar registros al iniciar
  useEffect(() => {
    fetch(`${API_URL}/api/registros`)
      .then((res) => res.json())
      .then((data) => setRegistros(data))
      .catch((error) => console.error("Error cargando registros:", error));
  }, []);

  // Convertir Bristol a texto
  const bristolLabel = (valor) => {
    switch (valor) {
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

  // Guardar registro
  const guardarDia = () => {
    const nuevoRegistro = {
      comida,
      urgencia,
      dolor,
      hinchazon,
      bristol,
    };

    return fetch(`${API_URL}/api/registros`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoRegistro),
    })
      .then((res) => res.json())
      .then((data) => {
        // Añadir al histórico
        setRegistros((prev) => [...prev, data]);

        // Reset SOLO cuando se guarda bien
        setComida("");
        setUrgencia(0);
        setDolor(0);
        setHinchazon(0);
        setBristol(3);
      })
      .catch((error) => console.error("Error guardando:", error));
  };

  // Borrar todo
  const borrarTodo = () => {
    return fetch(`${API_URL}/api/registros`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setRegistros([]))
      .catch((error) => console.error("Error borrando:", error));
  };

  return (
    <div>
      <h1>Registrar Día</h1>

      <textarea
        placeholder="¿Qué has comido?"
        value={comida}
        onChange={(e) => setComida(e.target.value)}
        rows={4}
      />

      <p>Urgencia: {urgencia}</p>
      <button
        type="button"
        onClick={() => setUrgencia(Math.min(10, urgencia + 1))}
      >
        +
      </button>
      <button
        type="button"
        onClick={() => setUrgencia(Math.max(0, urgencia - 1))}
      >
        -
      </button>

      <p>Hinchazón: {hinchazon}</p>
      <button
        type="button"
        onClick={() => setHinchazon(Math.min(10, hinchazon + 1))}
      >
        +
      </button>
      <button
        type="button"
        onClick={() => setHinchazon(Math.max(0, hinchazon - 1))}
      >
        -
      </button>

      <p>
        Bristol: {bristol} - {bristolLabel(bristol)}
      </p>
      <button
        type="button"
        onClick={() => setBristol(Math.min(7, bristol + 1))}
      >
        +
      </button>
      <button
        type="button"
        onClick={() => setBristol(Math.max(1, bristol - 1))}
      >
        -
      </button>

      <p>Dolor: {dolor}</p>
      <button type="button" onClick={() => setDolor(Math.min(10, dolor + 1))}>
        +
      </button>
      <button type="button" onClick={() => setDolor(Math.max(0, dolor - 1))}>
        -
      </button>

      <button onClick={guardarDia} disabled={!comida.trim()}>
        Guardar día
      </button>

      <h2>Histórico</h2>
      <button onClick={borrarTodo}>Eliminar todo</button>

      {registros.map((registro) => (
        <div
          key={registro.id}
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

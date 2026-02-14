import './App.css'
import { useState } from 'react'

function App() {
  const [comida, setComida] = useState('')
  const [urgencia, setUrgencia] = useState(0)
  const [dolor, setDolor] = useState(0)
  const [hinchazón, setHinchazón] = useState(0)
  const [bristol, setBristol] = useState(3)
  const [registros, setRegistros] = useState([])
  return (
    <div>
      <h1>Registrar Día</h1>

      <input
        type="text"
        placeholder="¿Qué has comido?"
        value={comida}
        onChange={(e) => setComida(e.target.value)}
      />

      <p>Urgencia: {urgencia}</p>
      <button onClick={() => setUrgencia(urgencia + 1)}>+</button>
      <button onClick={() => setUrgencia(urgencia - 1)}>-</button>

      <p>Hinchazón: {hinchazón}</p>
      <button onClick={() => setHinchazón(hinchazón + 1)}>+</button>
      <button onClick={() => setHinchazón(hinchazón - 1)}>-</button>

      <p>Bristol: {bristol}</p>
      <button onClick={() => setBristol(bristol + 1)}>+</button>
      <button onClick={() => setBristol(bristol - 1)}>-</button>

      <p>Dolor: {dolor}</p>
      <button onClick={() => setDolor(dolor + 1)}>+</button>
      <button onClick={() => setDolor(dolor - 1)}>-</button>  
    
      <button onClick={() => {
        const nuevoRegistro = {
          comida,
          urgencia,
          dolor,
          hinchazón,
          bristol,
          fecha: new Date().toLocaleDateString()
        }
        setRegistros([...registros, nuevoRegistro])
      }}
      >
        Guardar día
      </button>

      

      <textarea
        placeholder="¿Qué has comido hoy?"
        value={comida}
        onChange={(e) => setComida(e.target.value)}
        rows={4}
        />
      <label>Urgencia: {urgencia}</label>
      <input
        type="range"
        min="0"
        max="10"
        value={urgencia}
        onChange={(e) => setUrgencia(Number(e.target.value))}
      />
      <label>Dolor: {dolor}</label>
      <input
        type='range'
        min="0"
        max="10"
        value={dolor}
        onChange={(e) => setDolor(Number(e.target.value))}
      />

      <label>Hinchazón: {hinchazón}</label>
      <input
        type='range'
        min="0"
        max="10"
        value={hinchazón}
        onChange={(e) => setHinchazón(Number(e.target.value))}
      />

      <label>Bristol: {bristol}</label>
      <select value={bristol} onChange={(e) => setBristol(Number(e.target.value))}>
        <option value={1}>1 - Muy duro</option>
        <option value={2}>2 - Duro</option>
        <option value={3}>3 - Normal</option>
        <option value={4}>4 - Ideal</option>
        <option value={5}>5 - Blando</option>
        <option value={6}>6 - Diarrea</option>
        <option value={7}>7 - Liquida</option>
      </select>

      <h2>Historial</h2>

      {registros.map((registro, index) => (
        <div key={index} style={{ border: "1px solid gray", margin: "10px", padding: "10px"}}>
          <p>Fecha: {registro.fecha}</p>
          <p>Comida: {registro.comida}</p>
          <p>Urgencia: {registro.urgencia}</p>
          <p>Dolor: {registro.dolor}</p>
          <p>Hinchazón: {registro.hinchazón}</p>
          <p>Bristol: {registro.bristol}</p>
          </div>
      ))}

  </div>
  )
}

export default App

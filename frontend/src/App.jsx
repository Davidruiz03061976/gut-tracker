import './App.css'
import { useState, useEffect } from 'react'
// Componente principal de la aplicación
function App() {
  const [comida, setComida] = useState('')
  const [urgencia, setUrgencia] = useState(0)
  const [dolor, setDolor] = useState(0)
  const [hinchazon, setHinchazon] = useState(0)
  const [bristol, setBristol] = useState(3)
  const [registros, setRegistros] = useState(() => {
    const guardados = localStorage.getItem("gut-registros")
    return guardados ? JSON.parse(guardados) : []
  })
    
  useEffect(() => {
    localStorage.setItem("gut-registros", JSON.stringify(registros))
  }, [registros])   // Se guardan automaticamente los cambios

  const bristolLabel = (valor) => { // Función para convertir el valor de Bristol a su descripción
    switch (valor) {
      case 1: return "1 - Muy duro"
      case 2: return "2 - Duro"
      case 3: return "3 - Normal"
      case 4: return "4 - Ideal"
      case 5: return "5 - Blando"
      case 6: return "6 - Diarrea leve"
      case 7: return "7 - Diarrea líquida"
      default: return "Desconocido"
      }
    }
  const guardarDia = () => {
    const nuevoregistro = {
      comida,
      urgencia,
      dolor,
      hinchazon,
      bristol,
      fecha: new Date().toLocaleDateString()
    }
    setRegistros([...registros, nuevoregistro])

    // Reset formulario
    setComida('') 
    setUrgencia(0)
    setDolor(0)
    setHinchazon(0)
    setBristol(3)
    }
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
  onClick={() => {
    setUrgencia((u) => Math.min(10, u + 1))
  }}
>
  +
</button>

<button
  type="button"
  onClick={() => {
    setUrgencia((u) => Math.max(0, u - 1))
  }}
>
  -
</button>


     
      <p>Hinchazon: {hinchazon}</p>
      <button type="button" onClick={() => setHinchazon(Math.min(10, hinchazon + 1))}>+</button>
      <button type="button" onClick={() => setHinchazon(Math.max(0, hinchazon - 1))}>-</button>

      <p>Bristol: {bristolLabel(bristol)}</p>
      <button type="button" onClick={() => setBristol(Math.min(7, bristol + 1))}>+</button>
      <button type="button" onClick={() => setBristol(Math.max(1, bristol - 1))}>-</button>

      <p>Dolor: {dolor}</p>
      <button type="button" onClick={() => setDolor(Math.min(10, dolor + 1))}>+</button>
      <button type="button" onClick={() => setDolor(Math.max(0, dolor - 1))}>-</button>  
    
      <button type="button" onClick={guardarDia}>Guardar día</button>

      <h2>Historial</h2>
      <button onClick={() => {
        if (confirm("¿Estás seguro de que quieres eliminar todo el historial?")) {
          setRegistros([])
        } 
      }}  >Limpiar historial</button>

      {registros.map((registro, index) => (
        <div key={index} style={{ border: "1px solid gray", margin: "10px", padding: "10px"}}>
          <p>Fecha: {registro.fecha}</p>
          <p>Comida: {registro.comida}</p>
          <p>Urgencia: {registro.urgencia}</p>
          <p>Dolor: {registro.dolor}</p>
          <p>Hinchazón: {registro.hinchazón}</p>
          <p>Bristol: {registro.bristol} - {bristolLabel(registro.bristol)}</p>

          </div>
      ))}

  </div>
  )
}

export default App

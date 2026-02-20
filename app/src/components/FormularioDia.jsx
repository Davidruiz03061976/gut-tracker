export default function FormularioDia({
    comida,
    setComida,
    urgencia,
    setUrgencia,
    dolor,
    setDolor,
    hinchazon,
    setHinchazon,
    bristol,
    setBristol,
    bristolLabel,
    guardarDía,

}) {
    return (
        <>
        <textarea
        placeholder="¿Qué has comido?"
        value={comida}
        onChange={(e) => setComida(e.target.value)}
        rows={4}
        />
        <p>Urgencia: {urgencia}</p>
        <button type="button" onClick={() => setUrgencia(Math.min(10, urgencia + 1))}>+</button>
        <button type="button" onClick={() => setUrgencia(Math.max(0, urgencia - 1))}>-</button>
        <p>Hinchazon: {hinchazon}</p>
        <button type="button" onClick={() => setHinchazon(Math.min(10, hinchazon + 1))}>+</button>
        <button type="button" onClick={() => setHinchazon(Math.max(0, hinchazon - 1))}>-</button>
        <p>Bristol: {bristolLabel(bristol)}</p>
        <button type="button" onClick={() => setBristol(Math.min(7, bristol + 1))}>+</button>
        <button type="button" onClick={() => setBristol(Math.max(1, bristol - 1))}>-</button>
        <p>Dolor: {dolor}</p>
        <button type="button" onClick={() => setDolor(Math.min(10, dolor + 1))}>+</button>
        <button type="button" onClick={() => setDolor(Math.max(0, dolor - 1))}>-</button>
        <button type="button" onClick={guardarDía}>Guardar día</button>
    </>
    )


}
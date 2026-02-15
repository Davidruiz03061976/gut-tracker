export default function Historial({ registros, bristolLabel, limpiarHistorial }) 
{
    return (
        <>
        <h2>Historial</h2>
        <button type="button" onClick={limpiarHistorial}>Limpiar historial</button>
        
        {registros.length === 0 ? (
            <p>No hay registros aún</p>
        ) : (
            registros.map((registro, index) => (
                <div
                    key={ index}
                    style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}
                >
                    <p>Fecha: {registro.fecha}</p>
                    <p>Comida: {registro.comida}</p>
                    <p>Urgencia: {registro.urgencia}</p>
                    <p>Hinchazón: {registro.hinchazon}</p>
                    <p>Bristol: {bristolLabel(registro.bristol)}</p>
                    <p>Dolor: {registro.dolor}</p>
                </div>
            ))
        )}
        </>
    )
}

        

                
    



        
        



        
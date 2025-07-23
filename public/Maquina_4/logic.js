document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const SUPERVISOR = document.getElementById("nombreSupervisor").value;
  const CANTIDAD = parseInt(
    document.getElementById("estanteriasTrefiladas").value
  );
  const FECHA_INCIAL = document.getElementById("fechaInicioTurno").value;
  const FECHA_FINAL = document.getElementById("fechaFinalTurno").value;
  const TIEMPO_PRODUCCION = document.getElementById("tiempoProduccion").value;
  const TIEMPO_PARADA = parseFloat(
    document.getElementById("tiempoParadas").value
  );

  const data = {
    SUPERVISOR,
    CANTIDAD,
    FECHA_INCIAL,
    FECHA_FINAL,
    TIEMPO_PRODUCCION,
    TIEMPO_PARADA,
  };

  try {
    const res = await fetch("/api/maquina", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    alert(result.message);
  } catch (err) {
    console.error("❌ Error al enviar:", err);
    alert("Error al enviar");
  }
});

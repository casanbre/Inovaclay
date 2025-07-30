document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("formulario").addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
      SUPERVISOR: document.getElementById("nombreSupervisor").value,
      REFERENCIA: document.getElementById("referencia").value,
      CANTIDAD: Number(document.getElementById("estanteriasTrefiladas").value),
      CANTIDAD_H: Number(document.getElementById("estanteriasHumedas").value),
      CANTIDAD_C: Number(document.getElementById("estanteriasCuarto").value),
      CANTIDAD_A: Number(document.getElementById("estanteriasArreglar").value),
      FECHA_INICIAL: document.getElementById("fechaInicioTurno").value,
      FECHA_FINAL: document.getElementById("fechaFinalTurno").value,
      TIEMPO_PRODUCCION: Number(document.getElementById("tiempoProduccion").value),
      TIEMPO_PARADA: Number(document.getElementById("tiempoParadas").value),
    };

    for (const key in datos) {
      if (datos[key] === "" || datos[key] === null || Number.isNaN(datos[key])) {
        alert("Todos los campos son obligatorios. Por favor, completa el formulario.");
        return;
      }
    }

    try {
      const res = await fetch("/api/maquinas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const respuesta = await res.json();

      if (res.ok) {
        alert("✅ " + respuesta.message || "Datos guardados correctamente.");
        document.getElementById("formulario").reset();
      } else {
        alert("❌ Error: " + respuesta.message || "No se pudo guardar.");
      }
    } catch (error) {
      console.error("❌ Error de red:", error);
      alert("❌ Fallo la conexión con el servidor.");
    }
  });
});

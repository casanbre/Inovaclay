document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("formulario")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const datos = {
        SUPERVISOR: document.getElementById("nombreSupervisor").value,
        CANTIDAD: document.getElementById("estanteriasTrefiladas").value,
        CANTIDAD_H: document.getElementById("estanteriasHumedas").value,
        CANTIDAD_C: document.getElementById("estanteriasCuarto").value,
        FECHA_INCIAL: document.getElementById("fechaInicioTurno").value,
        FECHA_FINAL: document.getElementById("fechaFinalTurno").value,
        TIEMPO_PRODUCCION: document.getElementById("tiempoProduccion").value,
        TIEMPO_PARADA: document.getElementById("tiempoParadas").value,
      };

      try {
        const res = await fetch("/api/maquinas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });

        if (res.ok) {
          alert("Datos guardados correctamente ✅");
          document.getElementById("formulario").reset(); 
        } else {
          alert("Error al guardar los datos ❌");
        }
      } catch (error) {
        console.error("Error de red:", error);
        alert("Fallo la conexión con el servidor ❌");
      }
    });
});

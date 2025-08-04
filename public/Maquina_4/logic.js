document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("firmaCanvas");
    const ctx = canvas.getContext("2d");
    let dibujando = false;
  
    function getPosicion(e) {
      const rect = canvas.getBoundingClientRect();
      if (e.touches) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      } else {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
    }
  
    function trazar(x, y) {
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  
    function comenzarDibujo(e) {
      dibujando = true;
      const { x, y } = getPosicion(e);
      trazar(x, y);
    }
  
    function moverDibujo(e) {
      if (!dibujando) return;
      const { x, y } = getPosicion(e);
      trazar(x, y);
      if (e.cancelable) e.preventDefault(); // Previene desplazamiento en móviles
    }
  
    function finalizarDibujo() {
      dibujando = false;
      ctx.beginPath();
    }
  
    // Eventos mouse
    canvas.addEventListener("mousedown", comenzarDibujo);
    canvas.addEventListener("mousemove", moverDibujo);
    canvas.addEventListener("mouseup", finalizarDibujo);
    canvas.addEventListener("mouseout", finalizarDibujo);
  
    // Eventos touch
    canvas.addEventListener("touchstart", comenzarDibujo, { passive: false });
    canvas.addEventListener("touchmove", moverDibujo, { passive: false });
    canvas.addEventListener("touchend", finalizarDibujo);
  
    // Limpieza de firma
    window.limpiarFirma = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
    };
  
    // Envío de formulario
    document.getElementById("formulario").addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const firmaBase64 = canvas.toDataURL("image/png");
      document.getElementById("firmaInput").value = firmaBase64;
  
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
        FIRMA: firmaBase64,
      };
  
      for (const key in datos) {
        if (
          datos[key] === "" ||
          datos[key] === null ||
          Number.isNaN(datos[key])
        ) {
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
          alert("✅ " + (respuesta.message || "Datos guardados correctamente."));
          document.getElementById("formulario").reset();
          limpiarFirma();
        } else {
          alert("❌ Error: " + (respuesta.message || "No se pudo guardar."));
        }
      } catch (error) {
        console.error("❌ Error de red:", error);
        alert("❌ Fallo la conexión con el servidor.");
      }
    });
  });
  
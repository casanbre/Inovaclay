document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("firmaCanvas");
    const ctx = canvas.getContext("2d");
    let dibujando = false;
  
    // Función común para dibujar
    function trazar(x, y) {
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  
    // Eventos para mouse
    canvas.addEventListener("mousedown", (e) => {
      dibujando = true;
      const rect = canvas.getBoundingClientRect();
      trazar(e.clientX - rect.left, e.clientY - rect.top);
    });
    canvas.addEventListener("mouseup", () => {
      dibujando = false;
      ctx.beginPath();
    });
    canvas.addEventListener("mouseout", () => (dibujando = false));
    canvas.addEventListener("mousemove", (e) => {
      if (!dibujando) return;
      const rect = canvas.getBoundingClientRect();
      trazar(e.clientX - rect.left, e.clientY - rect.top);
    });
  
    // Eventos para touch
    canvas.addEventListener("touchstart", (e) => {
      dibujando = true;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      trazar(touch.clientX - rect.left, touch.clientY - rect.top);
    });
  
    canvas.addEventListener("touchmove", (e) => {
      if (!dibujando) return;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      trazar(touch.clientX - rect.left, touch.clientY - rect.top);
      e.preventDefault(); // Evita el desplazamiento mientras se firma
    }, { passive: false });
  
    canvas.addEventListener("touchend", () => {
      dibujando = false;
      ctx.beginPath();
    });
  
    // Función limpiar firma
    window.limpiarFirma = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
    };
  
    // Envío del formulario
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
  
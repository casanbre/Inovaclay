document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("firmaCanvas");
  const ctx = canvas.getContext("2d");

  // Ajustar resolución interna del canvas
  function ajustarResolucionCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
  }
  ajustarResolucionCanvas();

  // Firma en el canvas
  let dibujando = false;
  function trazar(x, y) {
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  // Eventos mouse
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

  // Eventos touch
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
    e.preventDefault();
  }, { passive: false });
  canvas.addEventListener("touchend", () => {
    dibujando = false;
    ctx.beginPath();
  });

  // Limpiar firma
  window.limpiarFirma = function () {
    ajustarResolucionCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  };

  // -------------------------------
  // Manejo de comentarios
  let comentarios = [];

  document.getElementById("btnAgregarComentario").addEventListener("click", () => {
    const texto = document.getElementById("nuevoComentario").value.trim();
    if (!texto) return alert("Escribe un comentario antes de agregarlo");

    comentarios.push({ numero: comentarios.length + 1, texto });
    document.getElementById("nuevoComentario").value = "";
    mostrarComentarios();
  });

  function mostrarComentarios() {
    const lista = document.getElementById("listaComentarios");
    lista.innerHTML = comentarios.map((c) => `<li>${c.numero}. ${c.texto}</li>`).join("");
  }

 
  document.getElementById("formulario").addEventListener("submit", async (e) => {
    e.preventDefault();

    const firmaBase64 = canvas.toDataURL("image/png");

    const datos = {
        SUPERVISOR: document.getElementById("nombreSupervisor").value,
        REFERENCIA: document.getElementById("referencia").value,
        CANTIDAD: Number(
          document.getElementById("estanteriasTrefiladas").value
        ),
        CANTIDAD_H: Number(document.getElementById("estanteriasHumedas").value),
        CANTIDAD_C: Number(document.getElementById("estanteriasCuarto").value),
        CANTIDAD_A: Number(
          document.getElementById("estanteriasArreglar").value
        ),
        FECHA_INICIAL: document.getElementById("fechaInicioTurno").value,
        FECHA_FINAL: document.getElementById("fechaFinalTurno").value,
        TIEMPO_PRODUCCION: Number(document.getElementById("tiempoProduccion").value),
        TIEMPO_PARADA: Number(document.getElementById("tiempoParadas").value),
        ESTANTERIAMQ: Number(document.getElementById("estanteriasCuartoQ").value),

        CANTIDAD_V_A_A: Number(document.getElementById("AvagonetasA").value),
        CANTIDAD_V_M_A: Number(document.getElementById("AvagonetasM").value),
        CARPAS: Number(document.getElementById("carpas").value),
        IMPULSOS: Number(document.getElementById("impulsos").value),
        CANTIDAD_V_A_D: Number(document.getElementById("DvagonetasA").value),
        CANTIDAD_V_M_D: Number(document.getElementById("DvagonetasM").value),

        MOLINO1_ESTADO: (document.getElementById("disponibleM3").value),
        MOLINO1_TONELADA: Number(document.getElementById("molino1").value),

        MOLINO2_ESTADO: (document.getElementById("disponibleM2").value),
        MOLINO2_TONELADA: Number(document.getElementById("molino2").value),

        MOLINO3_ESTADO: (document.getElementById("disponibleM3").value),
        MOLINO3_TONELADA: Number(document.getElementById("molino3").value),

        MOLINO_CARBON_ESTADO: (document.getElementById("disponibleCR").value),
        MOLINO_CAR_TONE: Number(document.getElementById("molinocarbon").value),


        comentarios: comentarios,
        FIRMA: firmaBase64,
    };

    // Validación
    for (const key in datos) {
      if (
        datos[key] === "" ||
        datos[key] === null ||
        (typeof datos[key] === "number" && Number.isNaN(datos[key]))
      ) {
        alert("Todos los campos son obligatorios. Completa el formulario.");
        return;
      }
    }

    try {
      const res = await fetch("https://inovaclay-1.onrender.com/api/maquina", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const respuesta = await res.json();

      if (res.ok) {
        alert("✅ " + (respuesta.message || "Datos guardados correctamente."));
        document.getElementById("formulario").reset();
        limpiarFirma();
        comentarios = [];
        mostrarComentarios();
      } else {
        alert("❌ Error: " + (respuesta.message || "No se pudo guardar ."));
      }
    } catch (error) {
      console.error("❌ Error de red:", error);
      alert("❌ Falló la conexión con el servidor.");
    }
  });
});

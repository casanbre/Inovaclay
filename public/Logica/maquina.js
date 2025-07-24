const opcionesPorMaquina = {
  Mezclador: ["MOTOR", "REDUCTOR", "PALETAS", "EJE"],
  Laminador: ["CORREA", "MASA", "PROTECTORES", "POLEAS", "MOTOR", "ESTRUCTURA"],
  "Banda corta": ["MOTOR", "REDUCTOR", "TAMBOR MOTRIZ", "TAMBOR CONDUCIDO", "RODILLOS", "BANDA", "CORREAS", "ESTRUCTURA"],
  "Banda diagonal": ["MOTOR", "REDUCTOR", "TAMBOR MOTRIZ", "TAMBOR CONDUCIDO", "RODILLOS", "BANDA", "CORREAS", "ESTRUCTURA"],
  "Banda 1": ["MOTOR", "REDUCTOR", "TAMBOR MOTRIZ", "TAMBOR CONDUCIDO", "RODILLOS", "BANDA", "CORREAS", "ESTRUCTURA"],
  "Banda 2": ["MOTOR", "REDUCTOR", "TAMBOR MOTRIZ", "TAMBOR CONDUCIDO", "RODILLOS", "BANDA", "CORREAS", "ESTRUCTURA"],
  "Banda 3": ["MOTOR", "REDUCTOR", "TAMBOR MOTRIZ", "TAMBOR CONDUCIDO", "RODILLOS", "BANDA", "CORREAS", "ESTRUCTURA"],
  "Cajon Alimentador 1": ["MOTOR", "REDUCTOR", "TAMBOR MOTRIZ", "TAMBOR CONDUCIDO", "RODILLOS", "BANDAS", "CORREAS", "ESTRUCTURA"],
  "Cajon Alimentador 2": ["MOTOR", "REDUCTOR", "TAMBOR MOTRIZ", "TAMBOR CONDUCIDO", "RODILLOS", "BANDAS", "CORREAS", "ESTRUCTURA"],
  Extrusora: ["PALETA", "MANITO", "CARACOLES", "VÁSTAGO", "ESTRELLAS", "CAMARA DE VACIO","EJE","RODAMIENTOS"],
  Corte: ["BANDA", "PRECORTE", "TORNILLO", "CORREAS", "RODILLOS", "FINAL DE CARRERA", "RODAMIENTO", "CHUMACERA", "POLEAS", "MOTOR", "REDUCTO", "ESTRUCTURA", "CABLEADO", "FLUIDO ELECTRICO", "SENSOR"],
  "Banco de cadena 1": ["SENSOR", "CABLEADO", "MOTOR", "REDUCTOR", "ENCODER", "CADENA", "PIÑÓN", "RODILLOS", "CILINDRO NEUMÁTICO", "ELECTROVÁLVULAS", "FLUIDO ELÉCTRICO"],
  "Banco de cadena 2": ["SENSOR", "CABLEADO", "MOTOR", "REDUCTOR", "ENCODER", "CADENA", "PIÑÓN", "RODILLOS", "CILINDRO NEUMÁTICO", "ELECTROVÁLVULAS", "FLUIDO ELÉCTRICO"],
  "Banco de cadena 3": ["SENSOR", "CABLEADO", "MOTOR", "REDUCTOR", "ENCODER", "CADENA", "PIÑÓN", "RODILLOS", "CILINDRO NEUMÁTICO", "ELECTROVÁLVULAS", "FLUIDO ELÉCTRICO"],
  "Banda de subida": ["MOTOR", "REDUCTOR", "TAMBOR MOTRIZ", "TAMBOR CONDUCIDO", "RODILLOS", "BANDA", "CORREAS", "ESTRUCTURA"],
  "Banda larga": ["MOTOR", "REDUCTOR", "TAMBOR MOTRIZ", "TAMBOR CONDUCIDO", "RODILLOS", "BANDA", "CORREAS", "ESTRUCTURA"],
  "Banda Programadora": ["BANDA PVC", "SENSOR", "MOTOR", "REDUCTOR", "ESTRUCTURA", "RODILLOS", "CHUMACERA", "RODAMIENTO"],
  "Banda Elevadora": ["BANDA PVC", "SENSOR", "MOTOR", "REDUCTOR", "ESTRUCTURA", "RODILLOS", "CHUMACERA", "RODAMIENTO", "FINAL DE CARRERA", "CILINDRO NEUMATICO", "ELECTRO VALVULA", "UNIDAD DE MTTO", "ESLINGA", "CADENA", "PIÑON"],
  "Mesa de Rodillos": ["RODILLOS", "CADENA", "CILINDRO NEUMATICO", "ESLINGA", "ESTRUCTURA"],
  "Falla electrica": ["FALLA ELECTRICA GENERAL"],
  Amasadora: ["REDUCTOR", "ESTRUCTURA", "EJE", "PALETAS", "VASTAGO"],
  "Rieles de estanteria": ["RODILLOS", "ESTRUCTURA"],
  "MANTENIMIENTO GENERAL": ["MTTO ELECTRICO-MECANICO"],
  "Otros": ["Otros"]
};

document.addEventListener("DOMContentLoaded", function () {
  const area = document.getElementById("area");
  const maquina = document.getElementById("maquina");
  const opciones = document.getElementById("opciones");
  const operativa = document.getElementById("opcionesOperativa");

  const maquinaContainer = document.getElementById("maquinaContainer");
  const opcionesContainer = document.getElementById("opcionesContainer");
  const opcionesOperativaContainer = document.getElementById("opcionesOperativaContainer");

  area.addEventListener("change", function () {
    const valor = area.value;

    if (valor === "OPERATIVA") {
      // mostrar select especial
      maquinaContainer.style.display = "none";
      opcionesContainer.style.display = "none";
      opcionesOperativaContainer.style.display = "block";

      maquina.required = false;
      opciones.required = false;
      operativa.required = true;
    } else {
      // mostrar opciones normales
      maquinaContainer.style.display = "block";
      opcionesContainer.style.display = "block";
      opcionesOperativaContainer.style.display = "none";

      maquina.required = true;
      opciones.required = true;
      operativa.required = false;

      // mostrar directamente opciones desde el área si existen
      const partes = opcionesPorMaquina[valor] || [];
      opciones.innerHTML = partes.length
        ? partes.map((p) => `<option value="${p}">${p}</option>`).join("")
        : `<option value="">Sin opciones</option>`;
    }
  });

  maquina.addEventListener("change", function () {
    const partes = opcionesPorMaquina[maquina.value] || [];
    opciones.innerHTML = partes.length
      ? partes.map((p) => `<option value="${p}">${p}</option>`).join("")
      : `<option value="">Sin opciones</option>`;
  });

  function calcularTiempo() {
    const inicio = document.getElementById("horaInicial").value;
    const fin = document.getElementById("horaFinal").value;

    if (inicio && fin) {
      const [hi, mi] = inicio.split(":").map(Number);
      const [hf, mf] = fin.split(":").map(Number);

      let totalMin = hf * 60 + mf - (hi * 60 + mi);
      if (totalMin < 0) totalMin += 1440;

      document.getElementById("horaTotal").value = totalMin;
    }
  }

  document.getElementById("horaInicial").addEventListener("input", calcularTiempo);
  document.getElementById("horaFinal").addEventListener("input", calcularTiempo);
});

document.getElementById("signatureForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const areaSeleccionada = document.getElementById("area").value;

  const data = {
    FECHA: document.getElementById("fecha").value,
    OPERADOR: document.getElementById("operadores").value,
    AREA: areaSeleccionada,
    MAQUINA: areaSeleccionada === "OPERATIVA" ? "operativa" : document.getElementById("maquina").value,
    OPCION: areaSeleccionada === "OPERATIVA"
      ? document.getElementById("opcionesOperativa").value
      : document.getElementById("opciones").value,
    HORA_INICIAL: document.getElementById("horaInicial").value,
    HORA_FINAL: document.getElementById("horaFinal").value,
    HORA_TOTAL: document.getElementById("horaTotal").value,
    OBSERVACION: document.getElementById("observaciones").value,
  };

  fetch("https://inovaclay-1.onrender.com/api/paradas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.success) {
        alert("✅ Datos enviados correctamente.");
        document.getElementById("signatureForm").reset();
        document.getElementById("horaTotal").value = "";
      } else {
        alert("⚠️ Error en el servidor: " + (response.message || "Sin mensaje."));
      }
    })
    .catch((error) => {
      console.error("❌ Error de red:", error);
      alert("No se pudo conectar al servidor.");
    });
});
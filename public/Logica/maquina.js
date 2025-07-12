const opcionesPorMaquina = {
  Mezclador: ["MOTOR", "REDUCTOR", "PALETAS", "EJE"],
  Laminador: ["CORREA", "MASA", "PROTECTORES", "POLEAS", "MOTOR","ESTRUCTURA"],
  "Banda corta": [
    "MOTOR",
    "REDUCTOR",
    "TAMBOR MOTRIZ",
    "TAMBOR CONDUCIDO",
    "RODILLOS",
    "BANDA",
    "CORREAS",
    "ESTRUCTURA",
  ],
  "Banda 1": [
    "MOTOR",
    "REDUCTOR",
    "TAMBOR MOTRIZ",
    "TAMBOR CONDUCIDO",
    "RODILLOS",
    "BANDA",
    "CORREAS",
    "ESTRUCTURA",
  ],
  "Banda 2": [
    "MOTOR",
    "REDUCTOR",
    "TAMBOR MOTRIZ",
    "TAMBOR CONDUCIDO",
    "RODILLOS",
    "BANDA",
    "CORREAS",
    "ESTRUCTURA",
  ],
  "Banda 3": [
    "MOTOR",
    "REDUCTOR",
    "TAMBOR MOTRIZ",
    "TAMBOR CONDUCIDO",
    "RODILLOS",
    "BANDA",
    "CORREAS",
    "ESTRUCTURA",
  ],
  "Cajon Alimentador 1": [
    "MOTOR",
    "REDUCTOR",
    "TAMBOR MOTRIZ",
    "TAMBOR CONDUCIDO",
    "RODILLOS",
    "BANDAS",
    "CORREAS",
    "ESTRUCTURA",
  ],
  "Cajon Alimentador 2": [
    "MOTOR",
    "REDUCTOR",
    "TAMBOR MOTRIZ",
    "TAMBOR CONDUCIDO",
    "RODILLOS",
    "BANDAS",
    "CORREAS",
    "ESTRUCTURA",
  ],
  Extrusora: ["PALETA", "MANITO", "CARACOLES", "VÁSTAGO", "ESTRELLAS","CAMARA DE VACIO"],
  Corte: [
    "BANDA",
    "PRECORTE",
    "TORNILLO",
    "CORREAS",
    "RODILLOS",
    "FINAL DE CARRERA",
    "RODAMIENTO",
    "CHUMACERA",
    "POLEAS",
    "MOTOR",
    "REDUCTO",
    "ESTRUCTURA",
    "CABLEADO",
    "FLUIDO ELECTRICO",
    "SENSOR",
  ],
  "Banco de cadena 1": [
    "SENSOR",
    "CABLEADO",
    "MOTOR",
    "REDUCTOR",
    "ENCODER",
    "CADENA",
    "PIÑÓN",
    "RODILLOS",
    "CILINDRO NEUMÁTICO",
    "ELECTROVÁLVULAS",
    "FLUIDO ELÉCTRICO",
  ],
  "Banda de subida":[
    "MOTOR",
    "REDUCTOR",
    "TAMBOR MOTRIZ",
    "TAMBOR CONDUCIDO",
    "RODILLOS",
    "BANDA",
    "CORREAS",
    "ESTRUCTURA",
  ],
  "Banda larga":[
    "MOTOR",
    "REDUCTOR",
    "TAMBOR MOTRIZ",
    "TAMBOR CONDUCIDO",
    "RODILLOS",
    "BANDA",
    "CORREAS",
    "ESTRUCTURA",
  ],

  "Banco de cadena 2": [
    "SENSOR",
    "CABLEADO",
    "MOTOR",
    "REDUCTOR",
    "ENCODER",
    "CADENA",
    "PIÑÓN",
    "RODILLOS",
    "CILINDRO NEUMÁTICO",
    "ELECTROVÁLVULAS",
    "FLUIDO ELÉCTRICO",
  ],
  "Banco de cadena 3": [
    "SENSOR",
    "CABLEADO",
    "MOTOR",
    "REDUCTOR",
    "ENCODER",
    "CADENA",
    "PIÑÓN",
    "RODILLOS",
    "CILINDRO NEUMÁTICO",
    "ELECTROVÁLVULAS",
    "FLUIDO ELÉCTRICO",
  ],
  "Banda Programadora": [
    "BANDA PVC",
    "SENSOR",
    "MOTOR",
    "REDUCTOR",
    "ESTRUCTURA",
    "RODILLOS",
    "CHUMACERA",
    "RODAMIENTO",
  ],
  "Banda Elevadora": [
    "BANDA PVC",
    "SENSOR",
    "MOTOR",
    "REDUCTOR",
    "ESTRUCTURA",
    "RODILLOS",
    "CHUMACERA",
    "RODAMIENTO",
    "FINAL DE CARRERA",
    "CILINDRO NEUMATICO",
    "ELECTRO VALVULA",
    "UNIDAD DE MTTO",
    "ESLINGA",
    "CADENA",
    "PIÑON",
  ],
  "Mesa de Rodillos": [
    "RODILLOS",
    "CADENA",
    "CILINDRO NEUMATICO",
    "ESLINGA",
    "EXTRUCTURA",
  ],
  "Falla electrica": ["FALLA ELECTRICA GENERAL"],
  Amasadora: ["REDUCTOR", "ESTRUCTURA", "EJE", "PALETAS", "VASTAGO"],
  "Rieles de estanteria": ["RODILLOS", "ESTRUCTURA"],
  "Mantenimiento general": ["MANTENIMIENTO GENERAL"],
  "Otros":["Otros"]
};

document.addEventListener("DOMContentLoaded", function () {
  const area = document.getElementById("area");
  const maquina = document.getElementById("maquina");
  const opciones = document.getElementById("opciones");
  const operativa = document.getElementById("opcionesOperativa");

  area.addEventListener("change", function () {
    const valor = area.value;

    const maquinaContainer = document.getElementById("maquinaContainer");
    const opcionesContainer = document.getElementById("opcionesContainer");
    const opcionesOperativaContainer = document.getElementById(
      "opcionesOperativaContainer"
    );

    if (valor === "OPERATIVA") {
      maquinaContainer.style.display = "none";
      opcionesContainer.style.display = "none";
      opcionesOperativaContainer.style.display = "block";

      maquina.required = false;
      opciones.required = false;
      operativa.required = true;
    } else {
      maquinaContainer.style.display = "block";
      opcionesContainer.style.display = "block";
      opcionesOperativaContainer.style.display = "none";

      maquina.required = true;
      opciones.required = true;
      operativa.required = false;
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
  

  document
    .getElementById("horaInicial")
    .addEventListener("input", calcularTiempo);
  document
    .getElementById("horaFinal")
    .addEventListener("input", calcularTiempo);
});

document
  .getElementById("signatureForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const data = {
      FECHA: document.getElementById("fecha").value,
      OPERADOR: document.getElementById("operadores").value,
      AREA: document.getElementById("area").value,
      MAQUINA:
        document.getElementById("area").value === "OPERATIVA"
          ? "operativa"
          : document.getElementById("maquina").value,
      OPCION:
        document.getElementById("area").value === "OPERATIVA"
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
          alert(
            "⚠️ Error en el servidor: " + (response.message || "Sin mensaje.")
          );
        }
      })
      .catch((error) => {
        console.error("❌ Error de red:", error);
        alert("No se pudo conectar al servidor.");
      });
  });

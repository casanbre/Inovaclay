document.getElementById("vagonetaForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const datosTurno = {
    operador: document.getElementById("operador").value,
    ayudante1: document.getElementById("ayudante1").value,
    ayudante2: document.getElementById("ayudante2").value,
    fecha: document.getElementById("fecha").value,
  };

  const registroVagoneta = {
    FECHA: new Date(datosTurno.fecha),
    OPERADOR: datosTurno.operador,
    AYUDANTE1: datosTurno.ayudante1,
    AYUDANTE2: datosTurno.ayudante2,
    VAGONETA: parseInt(document.getElementById("vagoneta").value),
    MATERIAL: document.getElementById("material").value,
    HORA_INICIO: document.getElementById("horaInicio").value,
    HORA_FINAL: document.getElementById("horaFinal").value,
    UNIDADES_ANTES: parseInt(document.getElementById("unidadesAntes").value) || 0,
    ESTIBAS: parseInt(document.getElementById("estibas").value) || 0,
    POR_ESTIBA: parseInt(document.getElementById("porEstiba").value) || 0,
    UNIDADES_DESPUES: parseInt(document.getElementById("unidadesDespues").value) || 0,
    SEGUNDA: parseInt(document.getElementById("segunda").value) || 0,
    OBSERVACIONES: document.getElementById("observaciones").value || ""
  };

  // ✅ Cálculo oculto del porcentaje de rotura
  const totalBuenas =
    registroVagoneta.ESTIBAS * registroVagoneta.POR_ESTIBA +
    registroVagoneta.UNIDADES_DESPUES +
    registroVagoneta.SEGUNDA;

  const rotura = registroVagoneta.UNIDADES_ANTES - totalBuenas;

  if (registroVagoneta.UNIDADES_ANTES > 0) {
    registroVagoneta.PORCENTAJE_ROTURA = Number(((rotura / registroVagoneta.UNIDADES_ANTES) * 100).toFixed(1));
  } else {
    registroVagoneta.PORCENTAJE_ROTURA = 0;
  }

  if (!registroVagoneta.OPERADOR || !registroVagoneta.AYUDANTE1 || !registroVagoneta.VAGONETA || !registroVagoneta.HORA_INICIO || !registroVagoneta.HORA_FINAL) {
    alert("⚠️ Por favor completa todos los campos obligatorios.");
    return;
  }

  if (!localStorage.getItem("turnoDatos")) {
    localStorage.setItem("turnoDatos", JSON.stringify(datosTurno));
  }

  fetch('/api/vagonetas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(registroVagoneta)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert("✅ Registro guardado correctamente en la base de datos.");
    } else {
      alert("⚠️ Error del servidor: " + data.message);
    }
  })
  .catch(error => {
    console.error('❌ Error al enviar datos:', error);
    alert("❌ Error de conexión con el servidor.");
  });

  localStorage.setItem("ultimoRegistro", JSON.stringify(registroVagoneta));

  [
    'vagoneta', 'material', 'horaInicio', 'horaFinal',
    'unidadesAntes', 'estibas', 'porEstiba',
    'unidadesDespues', 'segunda', 'observaciones'
  ].forEach(id => document.getElementById(id).value = '');

  document.getElementById("material").value = "4"; 

  deshabilitarTurno(true);
});

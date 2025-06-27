window.addEventListener("DOMContentLoaded", () => {
  const turno = localStorage.getItem("turnoDatos");
  const hoy = new Date().toISOString().split('T')[0];
  document.getElementById("fecha").value = hoy;

  if (turno) {
    const datos = JSON.parse(turno);
    document.getElementById("operador").value = datos.operador;
    document.getElementById("ayudante1").value = datos.ayudante1;
    document.getElementById("ayudante2").value = datos.ayudante2;
    document.getElementById("fecha").value = datos.fecha;

    deshabilitarTurno(true);
    mostrarMensajeTurno("✅ Turno cargado. Puedes registrar vagonetas.");
  }
});

function deshabilitarTurno(valor) {
  document.getElementById("operador").disabled = valor;
  document.getElementById("ayudante1").disabled = valor;
  document.getElementById("ayudante2").disabled = valor;
  document.getElementById("fecha").disabled = valor;
}

function mostrarMensajeTurno(mensaje) {
  const mensajeTurno = document.getElementById("mensajeTurno");
  if (mensajeTurno) {
    mensajeTurno.textContent = mensaje;
    mensajeTurno.style.color = "green";
  }
}

document.getElementById("editarTurno").addEventListener("click", () => {
  deshabilitarTurno(false);
  localStorage.removeItem("turnoDatos");
  mostrarMensajeTurno("✏️ Puedes editar el turno.");
});

document.getElementById("vagonetaForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const datosTurno = {
    operador: document.getElementById("operador").value,
    ayudante1: document.getElementById("ayudante1").value,
    ayudante2: document.getElementById("ayudante2").value,
    fecha: document.getElementById("fecha").value,
  };

  const registroVagoneta = {
    ...datosTurno,
    vagoneta: document.getElementById("vagoneta").value,
    material: document.getElementById("material").value,
    horaInicio: document.getElementById("horaInicio").value,
    horaFinal: document.getElementById("horaFinal").value,
    unidadesAntes: document.getElementById("unidadesAntes").value,
    estibas: document.getElementById("estibas").value,
    porEstiba: document.getElementById("porEstiba").value,
    unidadesDespues: document.getElementById("unidadesDespues").value,
    segunda: document.getElementById("segunda").value,
    observaciones: document.getElementById("observaciones").value
  };

  
  if (!registroVagoneta.operador || !registroVagoneta.ayudante1 || !registroVagoneta.vagoneta || !registroVagoneta.horaInicio || !registroVagoneta.horaFinal) {
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

window.addEventListener("DOMContentLoaded", () => {
    const turno = localStorage.getItem("turnoDatos");
    if (turno) {
      const datos = JSON.parse(turno);
      document.getElementById("operador").value = datos.operador;
      document.getElementById("ayudante1").value = datos.ayudante1;
      document.getElementById("ayudante2").value = datos.ayudante2;
      document.getElementById("fecha").value = datos.fecha;
  
      deshabilitarTurno(true);
    } else {
      // Asigna fecha actual por defecto
      const hoy = new Date().toISOString().split('T')[0];
      document.getElementById("fecha").value = hoy;
    }
  });
  
  function deshabilitarTurno(valor) {
    document.getElementById("operador").disabled = valor;
    document.getElementById("ayudante1").disabled = valor;
    document.getElementById("ayudante2").disabled = valor;
    document.getElementById("fecha").disabled = valor;
  }
  
  // Permitir editar turno
  document.getElementById("editarTurno").addEventListener("click", () => {
    deshabilitarTurno(false);
    localStorage.removeItem("turnoDatos");
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
  
    if (!localStorage.getItem("turnoDatos")) {
      localStorage.setItem("turnoDatos", JSON.stringify(datosTurno));
    }
  
    localStorage.setItem("ultimoRegistro", JSON.stringify(registroVagoneta));
    alert("Registro guardado correctamente");
  
    ['vagoneta', 'material', 'horaInicio', 'horaFinal', 'unidadesAntes', 'estibas', 'porEstiba', 'unidadesDespues', 'segunda', 'observaciones']
      .forEach(id => document.getElementById(id).value = '');
  
    document.getElementById("material").value = "4";
  
    deshabilitarTurno(true); 
  });

  window.addEventListener('DOMContentLoaded', () => {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha').value = hoy;
  });
  
  
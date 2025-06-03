const API_URL = "https://inovaclay-1.onrender.com/api/paradas";

const tbody = document.querySelector("#tablaUsuarios tbody");
const filtroFecha = document.getElementById("filtroFecha");

let datos = [];

function convertirFechaAISO(fechaDDMMYYYY) {
  const [dia, mes, anio] = fechaDDMMYYYY.split("/");
  return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

function renderizarFilas(data) {
  tbody.innerHTML = "";

  data.forEach((usuario, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${usuario.FECHA}</td>
      <td>${usuario.MAQUINA}</td>
      <td>${usuario.OPCION}</td>
      <td>${usuario.HORA_TOTAL}</td>
      <td>${usuario.OBSERVACION}</td>
    `;
    tbody.appendChild(fila);
  });
}

fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    datos = data;
    renderizarFilas(datos);
  })
  .catch(error => {
    console.error("Error al cargar datos:", error);
    tbody.innerHTML = `<tr><td colspan="6">Error al cargar datos</td></tr>`;
  });

filtroFecha.addEventListener("input", () => {
  const fechaSeleccionada = filtroFecha.value;

  if (!fechaSeleccionada) {
    renderizarFilas(datos);
    return;
  }

  const datosFiltrados = datos.filter(usuario => {
    const fechaISO = convertirFechaAISO(usuario.FECHA);
    return fechaISO === fechaSeleccionada;
  });

  renderizarFilas(datosFiltrados);
});

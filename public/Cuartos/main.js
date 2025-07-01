const productoSelect = document.getElementById("producto");
const subproductoSelect = document.getElementById("subproducto");
const subproductoGroup = document.getElementById("subproducto-group");
const formulario = document.getElementById("cuartoForm");

const subproductos = {
  Ladrillo: [
    "Ladrillo N°4",
    "Ladrillo N°3",
    "Ladrillo H6 #4",
    "Ladrillo N°5",
    "Ladrillo N°5 de 33",
    "Ladrillo N°6",
    "Ladrillo N°6 de 33",
    "Ladrillo N°8",
    "Ladrillo liso N°4"
  ],
  Adoquinesytoletes: [
    "Adoquin corbatin",
    "Tolete macizo",
    "Tolete perforado",
    "Tolete estructural",
    "Panela española"
  ],
  Estructurales: [
    "Estructural N°4 de perforacion vertical",
    "Estructural N°4 de 33 perforacion vertical",
    "Ladrillo estructural N°5",
    "Ladrillo estructural N°5 de 33",
    "Ladrillo estructural N°6"
  ],
  PlacaFacil: ["Bloquelon"]
};

productoSelect.addEventListener("change", () => {
  const selected = productoSelect.value;
  const opciones = subproductos[selected] || [];

  subproductoSelect.innerHTML = "";

  if (opciones.length > 0) {
    subproductoGroup.classList.add("visible");
    subproductoSelect.innerHTML = '<option value="">-- Seleccione --</option>';

    opciones.forEach((op) => {
      const option = document.createElement("option");
      option.value = op;
      option.textContent = op;
      subproductoSelect.appendChild(option);
    });

    subproductoSelect.required = true;
  } else {
    subproductoGroup.classList.remove("visible");
    subproductoSelect.required = false;
  }
});

function combinarHoraConFecha(horaStr) {
  const hoy = new Date();
  const [h, m] = horaStr.split(":");
  hoy.setHours(parseInt(h), parseInt(m), 0, 0);
  return hoy.toISOString();
}

formulario.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (subproductoGroup.classList.contains("visible") && !subproductoSelect.value) {
    alert("Por favor, selecciona un subproducto.");
    subproductoSelect.focus();
    return;
  }

  const horaInicioValue = document.getElementById("horaInicio").value;
  const horaCierreValue = document.getElementById("horaCierre").value;
  const horaFinalValue = document.getElementById("horaFinal").value;

  const datos = {
    cuarto: parseInt(document.getElementById("cuarto").value),
    producto: productoSelect.value,
    subproducto: subproductoSelect.value,
    hornillero1: document.getElementById("hornillero1").value,
    hornillero2: document.getElementById("hornillero2").value,
    horaInicio: horaInicioValue ? combinarHoraConFecha(horaInicioValue) : null,
    horaCierre: horaCierreValue ? combinarHoraConFecha(horaCierreValue) : null,
    horaFinal: horaFinalValue ? combinarHoraConFecha(horaFinalValue) : null,
    observaciones: document.getElementById("observaciones").value
  };

  try {
    const res = await fetch("https://inovaclay-1.onrender.com/api/cuartos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const resultado = await res.json();

    if (res.ok) {
      alert("✅ Datos guardados correctamente");
      formulario.reset();
      subproductoGroup.classList.remove("visible");
    } else {
      alert("❌ Error al guardar: " + resultado.mensaje);
    }
  } catch (error) {
    console.error("❌ Error al enviar:", error);
    alert("Error de conexión con el servidor");
  }
});

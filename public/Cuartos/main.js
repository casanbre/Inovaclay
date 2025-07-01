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

// Mostrar subproductos según el producto elegido
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

// ✅ Función para procesar datetime-local correctamente
function combinarHoraConFecha(datetimeLocalStr) {
  return datetimeLocalStr ? datetimeLocalStr + ":00" : null;
}

// Envío del formulario con fetch()
formulario.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (subproductoGroup.classList.contains("visible") && !subproductoSelect.value) {
    alert("Por favor, selecciona un subproducto.");
    subproductoSelect.focus();
    return;
  }

  const datos = {
    cuarto: parseInt(document.getElementById("cuarto").value),
    producto: productoSelect.value,
    subproducto: subproductoSelect.value,
    hornillero1: document.getElementById("hornillero1").value,
    hornillero2: document.getElementById("hornillero2").value,
    horaInicio: combinarHoraConFecha(document.getElementById("horaInicio").value),
    horaCierre: combinarHoraConFecha(document.getElementById("horaCierre").value),
    horaFinal: combinarHoraConFecha(document.getElementById("horaFinal").value),
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


document.getElementById("cuarto").addEventListener("change", async function () {
  const cuartoSeleccionado = parseInt(this.value);

  if (!cuartoSeleccionado) return;

  try {
    const res = await fetch("https://inovaclay-1.onrender.com/api/cuartos");
    const cuartos = await res.json();

    const activo = cuartos.find(c => c.cuarto === cuartoSeleccionado && !c.completado);

    const deshabilitar = !!activo;

    // Campos a bloquear si ya fue iniciado
    const camposABloquear = [
      "producto",
      "subproducto",
      "hornillero1",
      "hornillero2",
      "horaInicio"
    ];

    camposABloquear.forEach(id => {
      const campo = document.getElementById(id);
      campo.disabled = deshabilitar;
    });

    // Si se bloquean, rellena los valores previos en los campos
    if (activo) {
      document.getElementById("producto").value = activo.producto || "";
      productoSelect.dispatchEvent(new Event("change")); // para cargar subproducto
      setTimeout(() => {
        document.getElementById("subproducto").value = activo.subproducto || "";
      }, 100);

      document.getElementById("hornillero1").value = activo.hornillero1 || "";
      document.getElementById("hornillero2").value = activo.hornillero2 || "";
      document.getElementById("horaInicio").value = activo.horaInicio
        ? activo.horaInicio.slice(0, 16)
        : "";
    } else {
      formulario.reset();
      subproductoGroup.classList.remove("visible");
    }
  } catch (error) {
    console.error("❌ Error al verificar el cuarto:", error);
  }
});

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

// Cuando cambia el producto, mostrar subproductos si existen
productoSelect.addEventListener("change", () => {
  const selected = productoSelect.value;
  const opciones = subproductos[selected] || [];

  subproductoSelect.innerHTML = "";

  if (opciones.length > 0) {
    subproductoGroup.classList.add("visible");
    subproductoSelect.innerHTML = '<option value="">-- Seleccione --</option>'; // Placeholder

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

// Validación al enviar el formulario
formulario.addEventListener("submit", function (e) {
  // Si el grupo subproducto está visible, validar que tenga valor
  if (subproductoGroup.classList.contains("visible")) {
    if (!subproductoSelect.value) {
      alert("Por favor, selecciona un subproducto.");
      subproductoSelect.focus();
      e.preventDefault(); // Detiene el envío
      return;
    }
  }

  // [OPCIONAL] Mostrar los datos enviados en consola para verificar
  const formData = new FormData(formulario);
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  // Aquí puedes agregar tu fetch() si lo haces por JS (AJAX)
});

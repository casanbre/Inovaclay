

const productosMq4 = [
  "Ladrillo N°4",
  "Ladrillo N°5"
];

// Elementos
const maquinaSelect = document.getElementById("nombreMaquina");
const referenciaSelect = document.getElementById("referencia");

// Escucha cambios en el select de máquina
maquinaSelect.addEventListener("change", () => {
  const maquina = maquinaSelect.value;

  // Limpiar referencias
  referenciaSelect.innerHTML = '<option value="" disabled selected>Seleccione una referencia</option>';

  if (maquina === "ROBOT APILADO" || maquina === "ROBOT DESAPILADO") {
    productosMq4.forEach(item => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      referenciaSelect.appendChild(option);
    });
  } 
});

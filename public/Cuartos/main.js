const productoSelect = document.getElementById("producto");
const subproductoSelect = document.getElementById("subproducto");
const subproductoGroup = document.getElementById("subproducto-group");

const subproductos = {
  Ladrillo: ["Ladrillo N°4", "Ladrillo N°3","Ladrillo H6 #4","Ladrillo N°5","Ladrillo N°5 de 33","Ladrillo N°6","Ladrillo N°6 de 33","Ladrillo N°8","Ldrillo liso N°4"],
  Adoquinesytoletes: ["Adoquin corbatin","Tolete macizo","Tolete perforado","Tolete estructural","Panela española"],
  Estructurales: ["Estructural N°4 de perforacion vertical", "Estructural N°4 de 33 perforacion vertical","Ladrillo estructural N°5", "Ladrillo estructural N°5 de 33","Ladrillo estructural N°6"],
  PlacaFacil: ["Bloquelon"],
};

productoSelect.addEventListener("change", () => {
  const selected = productoSelect.value;
  const opciones = subproductos[selected] || [];

  subproductoSelect.innerHTML = "";

  if (opciones.length > 0) {
    subproductoGroup.classList.add("visible");

    opciones.forEach((op) => {
      const option = document.createElement("option");
      option.value = op;
      option.textContent = op;
      subproductoSelect.appendChild(option);
    });
  } else {
    subproductoGroup.classList.remove("visible");
  }
});


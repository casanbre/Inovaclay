const subproductos = [
  "Ladrillo N°4",
  "Ladrillo N°3",
  "Ladrillo H6 #4 33",
  "Ladrillo H6 #4 40",
  "Ladrillo N°5",
  "Ladrillo N°5 de 33",
  "Ladrillo N°6",
  "Ladrillo N°6 de 33",
  "Ladrillo N°8",
  "Ladrillo liso N°4",
  "Adoquin corbatin",
  "Tolete multiperforado",
  "Tolete macizo",
  "Tolete perforado",
  "Tolete estructural",
  "Panela española",
  "Estructural N°4 de perforacion vertical",
  "Estructural N°4 de 33 perforacion vertical",
  "Ladrillo estructural N°5",
  "Ladrillo estructural N°5 de 33",
  "Ladrillo estructural N°6",
  "Bloquelon"
];

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

  if (maquina === "Maquina 3" || maquina === "Maquina 1") {
    subproductos.forEach(item => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      referenciaSelect.appendChild(option);
    });
  } 
  else if (maquina === "Maquina 4") {
    productosMq4.forEach(item => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      referenciaSelect.appendChild(option);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario");

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Capturar todos los valores del formulario
    const data = {
      SUPERVISOR: document.getElementById("nombreSupervisor").value,
      MACHIN: document.getElementById("nombreMaquina").value,
      FECHA: document.getElementById("fechaInicioTurno").value,
      HORA: document.getElementById("horaInicioTurno").value,
      REFERENCIA: document.getElementById("referencia").value,
      VACIO: document.getElementById("vaciohg").value,
      DUROMETRO: document.getElementById("durometro").value,
      LARGO: document.getElementById("largo").value,
      ANCHO: document.getElementById("ancho").value,
      ALTO: document.getElementById("alto").value,
      AMPERAJE: document.getElementById("amperaje").value,
      CORTES: document.getElementById("cortes").value,
      CRITERIO: document.querySelector('input[name="prueba_1"]:checked')?.value || "NO",
      OBSERVACIONES: document.getElementById("observaciones_1").value,
      ASPECTOCORTADO: document.getElementById("apariencia").value,
      ASPECTOESTANTERIA: document.getElementById("aparienciaEstanteria").value,
      LAMINILLA: document.getElementById("revision").value,
      REVISION: document.querySelector('input[name="orden"]:checked')?.value || "",
      OBSERVACIONES_A: document.getElementById("observaciones").value,
    };

    try {
      // 👇 Aquí cambias el localhost por tu dominio en la nube
      const response = await fetch("https://inovaclay-1.onrender.com/api/super", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Datos enviados correctamente");
        formulario.reset();
      } else {
        alert("❌ Error al enviar los datos");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ No se pudo conectar con el servidor");
    }
  });
});

document.getElementById('formulario').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const datos = {
      SUPERVISOR: document.getElementById('SUPERVISOR').value,
      CANTIDAD: document.getElementById('CANTIDAD').value,
      FECHA_INCIAL: document.getElementById('FECHA_INCIAL').value,
      FECHA_FINAL: document.getElementById('FECHA_FINAL').value,
      TIEMPO_PRODUCCION: document.getElementById('TIEMPO_PRODUCCION').value,
      TIEMPO_PARADA: document.getElementById('TIEMPO_PARADA').value,
    };
  
    try {
      const res = await fetch('/api/maquinas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
  
      if (res.ok) {
        alert('Datos guardados correctamente ✅');
  
        // 👉 Aquí se limpian los campos
        document.getElementById('formulario').reset();
      } else {
        alert('Error al guardar los datos ❌');
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Fallo la conexión con el servidor ❌');
    }
  });
  
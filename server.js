const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Esquema de MongoDB
const paradaSchema = new mongoose.Schema({
  FECHA: { type: Date, required: true },
  OPERADOR: { type: String, required: true },
  AREA: { type: String, required: true },
  MAQUINA: { type: String, default: null },
  OPCION: { type: String, required: true },
  HORA_INICIAL: { type: String, required: true },
  HORA_FINAL: { type: String, required: true },
  HORA_TOTAL: { type: String, required: true },
  OBSERVACION: { type: String, default: '' }
});

const Parada = mongoose.model('Parada', paradaSchema);

// Ruta POST para guardar paradas
app.post('/api/paradas', async (req, res) => {
  try {
    const datos = req.body;

    const nuevaParada = new Parada({
      FECHA: datos.fechas,
      OPERADOR: datos.operador,
      AREA: datos.areas,
      MAQUINA: datos.areas === "OPERATIVA" ? null : datos.maquinas,
      OPCION: datos.opcion,
      HORA_INICIAL: datos.horainicials,
      HORA_FINAL: datos.horafinals,
      HORA_TOTAL: datos.horatotals,
      OBSERVACION: datos.observaciones
    });

    await nuevaParada.save();
    res.status(201).json({ success: true, message: 'Parada guardada correctamente.' });
  } catch (error) {
    console.error('Error al guardar parada:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor.' });
  }
});

// Ruta GET para obtener todas las paradas (con fecha formateada)
app.get('/api/paradas', async (req, res) => {
  try {
    const paradas = await Parada.find().sort({ FECHA: -1 });

    const paradasFormateadas = paradas.map(parada => {
      const fechaFormateada = new Date(parada.FECHA).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      return {
        ...parada.toObject(),
        FECHA: fechaFormateada
      };
    });

    res.json(paradasFormateadas);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener paradas.' });
  }
});

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ mensaje: '¡Tu backend está funcionando!' });
});

// Enviar el formulario HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mq4.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

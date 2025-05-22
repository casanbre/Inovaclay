const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'InovaClay/public'
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
  OBSERVACION: { type: String, default: '' }
});

const Parada = mongoose.model('Parada', paradaSchema);

// Ruta POST para guardar paradas
app.post('/api/paradas', async (req, res) => {
  try {
    const nuevaParada = new Parada(req.body);
    await nuevaParada.save();
    res.status(201).json({ success: true, message: 'Parada guardada correctamente.' });
  } catch (error) {
    console.error('Error al guardar parada:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor.' });
  }
});

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ mensaje: '¡Tu backend está funcionando!' });
});

const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mq4.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

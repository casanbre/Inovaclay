const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static('public'));

console.log("🔍 URI leída del .env:", process.env.MONGO_URI);



mongoose.connect(process.env.MONGO_URI)

const paradaSchema = new mongoose.Schema({
  FECHA: { type: Date, required: true },
  OPERADOR: { type: String, required: true },
  AREA: { type: String, required: true },
  MAQUINA: { type: String, default: 'operativa' },
  OPCION: { type: String, required: true },
  HORA_INICIAL: { type: String, required: true },
  HORA_FINAL: { type: String, required: true },
  HORA_TOTAL: { type: String, required: true },
  OBSERVACION: { type: String, default: '' }
});
const Parada = mongoose.model('Parada', paradaSchema);

const registroVagonetaSchema = new mongoose.Schema({
  FECHA: { type: Date, required: true },
  OPERADOR: { type: String, required: true },
  AYUDANTE1: { type: String, required: true },
  AYUDANTE2: { type: String },
  VAGONETA: { type: Number, required: true },
  MATERIAL: { type: String, required: true },
  HORA_INICIO: { type: String, required: true },
  HORA_FINAL: { type: String, required: true },
  UNIDADES_ANTES: Number,
  ESTIBAS: Number,
  POR_ESTIBA: Number,
  UNIDADES_DESPUES: Number,
  SEGUNDA: Number,
  OBSERVACIONES: String
});
const RegistroVagoneta = mongoose.model('RegistroVagoneta', registroVagonetaSchema);

app.post('/api/paradas', async (req, res) => {
  try {
    const datos = req.body;
    const maquinaFinal = !datos.maquinas || datos.maquinas === 'null' ? 'OPERATIVA' : datos.maquinas;

    const nuevaParada = new Parada({
      FECHA: datos.fechas,
      OPERADOR: datos.operador,
      AREA: datos.areas,
      MAQUINA: maquinaFinal,
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

app.get('/api/paradas', async (req, res) => {
  try {
    const paradas = await Parada.find().sort({ FECHA: -1 });

    const paradasFormateadas = paradas.map(parada => ({
      ...parada.toObject(),
      FECHA: new Date(parada.FECHA).toISOString().split('T')[0]
    }));

    res.json(paradasFormateadas);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener paradas.' });
  }
});


app.post('/api/vagonetas', async (req, res) => {
  try {
    const datos = req.body;

    const nuevoRegistro = new RegistroVagoneta({
      FECHA: datos.fecha,
      OPERADOR: datos.operador,
      AYUDANTE1: datos.ayudante1,
      AYUDANTE2: datos.ayudante2,
      VAGONETA: datos.vagoneta,
      MATERIAL: datos.material,
      HORA_INICIO: datos.horaInicio,
      HORA_FINAL: datos.horaFinal,
      UNIDADES_ANTES: datos.unidadesAntes,
      ESTIBAS: datos.estibas,
      POR_ESTIBA: datos.porEstiba,
      UNIDADES_DESPUES: datos.unidadesDespues,
      SEGUNDA: datos.segunda,
      OBSERVACIONES: datos.observaciones
    });

    await nuevoRegistro.save();
    res.status(201).json({ success: true, message: 'Registro guardado correctamente' });
  } catch (error) {
    console.error('❌ Error al guardar registro:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

app.get('/api/vagonetas', async (req, res) => {
  try {
    const registros = await RegistroVagoneta.find().sort({ FECHA: -1 });

    const registrosFormateados = registros.map(registro => ({
      ...registro.toObject(),
      FECHA: new Date(registro.FECHA).toISOString().split('T')[0]  
    }));

    res.json(registrosFormateados);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener los registros' });
  }
});



app.get('/vagonetas', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'vagonetas.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mq4.html'));
});

app.get('/api', (req, res) => {
  res.json({ mensaje: '¡Tu backend está funcionando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

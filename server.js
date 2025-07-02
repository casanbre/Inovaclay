// server.js
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

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión:", err));

// --------------------- MODELOS ---------------------

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

const cuartoSchema = new mongoose.Schema({
  cuarto: { type: Number, required: true },
  producto: { type: String },
  subproducto: { type: String },
  hornillero1: { type: String },
  hornillero2: { type: String },
  horaInicio: { type: Date },
  horaCierre: { type: Date },
  horaFinal: { type: Date },
  duracionIngreso: { type: String },
  duracionTotal: { type: String },
  observaciones: { type: String },
  completado: { type: Boolean, default: false }
});
cuartoSchema.index({ cuarto: 1, completado: 1 }, { unique: true, partialFilterExpression: { completado: false } });
const CuartoSecado = mongoose.model('CuartoSecado', cuartoSchema);

// --------------------- RUTAS ---------------------

app.post('/api/cuartos', async (req, res) => {
  const { cuarto, producto, subproducto, hornillero1, hornillero2, horaInicio, horaCierre, horaFinal, observaciones } = req.body;
  console.log("📩 Datos recibidos en /api/cuartos:", req.body);
  if (!cuarto || isNaN(cuarto)) return res.status(400).json({ mensaje: 'Cuarto inválido' });

  try {
    let registro = await CuartoSecado.findOne({ cuarto, completado: false });
    const parsedInicio = horaInicio ? new Date(horaInicio) : undefined;
    const parsedCierre = horaCierre ? new Date(horaCierre) : undefined;
    const parsedFinal = horaFinal ? new Date(horaFinal) : undefined;

    if (!registro) {
      const nuevo = new CuartoSecado({
        cuarto, producto, subproducto, hornillero1, hornillero2,
        horaInicio: parsedInicio,
        horaCierre: parsedCierre,
        horaFinal: parsedFinal,
        observaciones,
        completado: !!parsedFinal
      });
      if (parsedCierre && parsedInicio) {
        const min = Math.floor((parsedCierre - parsedInicio) / 60000);
        nuevo.duracionIngreso = `${Math.floor(min / 60)}h ${min % 60}min`;
      }
      if (parsedFinal && parsedInicio) {
        const min = Math.floor((parsedFinal - parsedInicio) / 60000);
        nuevo.duracionTotal = `${Math.floor(min / 60)}h ${min % 60}min`;
      }
      await nuevo.save();
      return res.status(201).json({ mensaje: 'Registro creado con hora(s).' });
    }

    if (parsedCierre && !registro.horaCierre) {
      registro.horaCierre = parsedCierre;
      if (registro.horaInicio) {
        const min = Math.floor((parsedCierre - registro.horaInicio) / 60000);
        registro.duracionIngreso = `${Math.floor(min / 60)}h ${min % 60}min`;
      }
    }

    if (parsedFinal && !registro.horaFinal) {
      registro.horaFinal = parsedFinal;
      registro.completado = true;
      if (registro.horaInicio) {
        const min = Math.floor((parsedFinal - registro.horaInicio) / 60000);
        registro.duracionTotal = `${Math.floor(min / 60)}h ${min % 60}min`;
      }
    }

    await registro.save();
    res.status(200).json({ mensaje: 'Registro actualizado correctamente.' });
  } catch (error) {
    console.error('❌ Error en el servidor:', error);
    res.status(500).json({ mensaje: 'Error al guardar los datos.' });
  }
});

app.get('/api/cuartos', async (req, res) => {
  try {
    const registros = await CuartoSecado.find().sort({ horaInicio: -1 });
    res.json(registros);
  } catch (err) {
    console.error('❌ Error al obtener cuartos:', err);
    res.status(500).json({ mensaje: 'Error al obtener cuartos' });
  }
});

app.post('/api/vagonetas', async (req, res) => {
  try {
    const datos = req.body;
    const nuevoRegistro = new RegistroVagoneta({
      FECHA: datos.FECHA,
      OPERADOR: datos.OPERADOR,
      AYUDANTE1: datos.AYUDANTE1,
      AYUDANTE2: datos.AYUDANTE2,
      VAGONETA: datos.VAGONETA,
      MATERIAL: datos.MATERIAL,
      HORA_INICIO: datos.HORA_INICIO,
      HORA_FINAL: datos.HORA_FINAL,
      UNIDADES_ANTES: datos.UNIDADES_ANTES,
      ESTIBAS: datos.ESTIBAS,
      POR_ESTIBA: datos.POR_ESTIBA,
      UNIDADES_DESPUES: datos.UNIDADES_DESPUES,
      SEGUNDA: datos.SEGUNDA,
      OBSERVACIONES: datos.OBSERVACIONES
    });
    await nuevoRegistro.save();
    res.status(201).json({ success: true, message: 'Registro de vagoneta guardado correctamente.' });
  } catch (error) {
    console.error('❌ Error al guardar registro de vagoneta:', error);
    res.status(500).json({ success: false, message: 'Error al guardar registro de vagoneta.' });
  }
});

app.get('/api/vagonetas', async (req, res) => {
  try {
    const registros = await RegistroVagoneta.find().sort({ FECHA: -1 });
    const formateados = registros.map(reg => ({
      ...reg.toObject(),
      FECHA: reg.FECHA.toISOString().split('T')[0]
    }));
    res.json(formateados);
  } catch (error) {
    console.error('❌ Error al obtener vagonetas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener registros de vagonetas.' });
  }
});



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mq4.html'));
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión:", err));


const paradaSchema = new mongoose.Schema({
  FECHA: { type: Date, required: true },
  OPERADOR: { type: String, required: true },
  AREA: { type: String, required: true },
  MAQUINA: { type: String, default: 'operativa' },
  OPCION: { type: String, required: true },
  HORA_INICIAL: { type: String, required: true },
  HORA_FINAL: { type: String, required: true },
  HORA_TOTAL: { type: Number, required: true },
  OBSERVACION: { type: String, default: ''}
});
const Parada = mongoose.model('Parada', paradaSchema);

const maquinaSchema = new mongoose.Schema({
  SUPERVISOR: {type: String,required: true},
  REFERENCIA: {type: String,requiered: true},
  CANTIDAD: {type: Number, required: true},
  CANTIDAD_H: {type: Number, required: true},
  CANTIDAD_C: {type: Number, required:true},
  CANTIDAD_A: {type: Number, required:true},
  ESTANTERIA_D: {type: Number, required: true},
  FECHA_INICIAL: {type: Date, required: true},
  FECHA_FINAL: {type: Date, required: true},
  TIEMPO_PRODUCCION: {type: Number, required: true},
  TIEMPO_PARADA: {type: Number, required: true}
})
const Maquina = mongoose.model('Maquina', maquinaSchema);


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
  OBSERVACIONES: String,
  PORCENTAJE_ROTURA: Number,
  PNC: Number
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
  duracionIngreso: { type: Number },  
  duracionTotal: { type: Number },    
  observaciones: { type: String },
  completado: { type: Boolean, default: false }
});
cuartoSchema.index({ cuarto: 1, completado: 1 }, { unique: true, partialFilterExpression: { completado: false } });
const CuartoSecado = mongoose.model('CuartoSecado', cuartoSchema);


async function actualizarRoturaEnVagonetas() {
  try {
    const registros = await RegistroVagoneta.find();

    for (const reg of registros) {
      const unidadesAntes = reg.UNIDADES_ANTES || 0;
      const estibas = reg.ESTIBAS || 0;
      const porEstiba = reg.POR_ESTIBA || 0;
      const unidadesDespues = reg.UNIDADES_DESPUES || 0;
      const segunda = reg.SEGUNDA || 0;

      const totalBuenas = estibas * porEstiba + unidadesDespues + segunda;
      const rotura = unidadesAntes - totalBuenas;

      reg.PORCENTAJE_ROTURA = unidadesAntes > 0
        ? Number(((rotura / unidadesAntes) * 100).toFixed(1))
        : 0;

      reg.PNC = unidadesAntes > 0
        ? Number((((rotura + segunda) / unidadesAntes) * 100).toFixed(1))
        : 0;

      await reg.save();
    }

    console.log(`✅ ${registros.length} registros actualizados con rotura/PNC`);
  } catch (error) {
    console.error('❌ Error actualizando rotura/PNC:', error);
  }
}


async function limpiarDatosInvalidos() {
  try {
    const res1 = await CuartoSecado.deleteMany({ duracionIngreso: { $type: "string" } });
    const res2 = await CuartoSecado.deleteMany({ duracionTotal: { $type: "string" } });
    console.log(`🧹 Registros corregidos: ${res1.deletedCount + res2.deletedCount}`);
  } catch (e) {
    console.error("❌ Error limpiando registros inválidos:", e);
  }
}


app.post('/api/cuartos', async (req, res) => {
  const { cuarto, producto, subproducto, hornillero1, hornillero2, horaInicio, horaCierre, horaFinal, observaciones } = req.body;
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
        nuevo.duracionIngreso = Math.floor((parsedCierre - parsedInicio) / 60000);
      }
      if (parsedFinal && parsedInicio) {
        nuevo.duracionTotal = Math.floor((parsedFinal - parsedInicio) / 60000);
      }

      await nuevo.save();
      return res.status(201).json({ mensaje: 'Registro creado con hora(s).' });
    }

    if (parsedCierre && !registro.horaCierre) {
      registro.horaCierre = parsedCierre;
      if (registro.horaInicio) {
        registro.duracionIngreso = Math.floor((parsedCierre - registro.horaInicio) / 60000);
      }
    }

    if (parsedFinal && !registro.horaFinal) {
      registro.horaFinal = parsedFinal;
      registro.completado = true;
      if (registro.horaInicio) {
        registro.duracionTotal = Math.floor((parsedFinal - registro.horaInicio) / 60000);
      }
    }

    await registro.save();
    res.status(200).json({ mensaje: 'Registro actualizado correctamente.' });
  } catch (error) {
    console.error('❌ Error en /api/cuartos:', error);
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

    const unidadesAntes = datos.UNIDADES_ANTES || 0;
    const estibas = datos.ESTIBAS || 0;
    const porEstiba = datos.POR_ESTIBA || 0;
    const unidadesDespues = datos.UNIDADES_DESPUES || 0;
    const segunda = datos.SEGUNDA || 0;

    const totalBuenas = (estibas * porEstiba) + unidadesDespues + segunda;
    const rotura = unidadesAntes - totalBuenas;

    datos.PORCENTAJE_ROTURA = unidadesAntes > 0
      ? Number(((rotura / unidadesAntes) * 100).toFixed(1))
      : 0;

    datos.PNC = unidadesAntes > 0
      ? Number((((rotura + segunda) / unidadesAntes) * 100).toFixed(1))
      : 0;

    const nuevoRegistro = new RegistroVagoneta(datos);
    await nuevoRegistro.save();

    res.status(201).json({ success: true, message: 'Registro guardado.', porcentaje: datos.PORCENTAJE_ROTURA, pnc: datos.PNC });
  } catch (error) {
    console.error('❌ Error en /api/vagonetas:', error);
    res.status(500).json({ success: false, message: 'Error al guardar vagoneta.' });
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
    res.status(500).json({ success: false, message: 'Error al obtener registros.' });
  }
});

app.post('/api/paradas', async (req, res) => {
  try {
    const nuevaParada = new Parada(req.body);
    await nuevaParada.save();
    res.status(201).json({ success: true, message: 'Parada registrada correctamente.' });
  } catch (error) {
    console.error('❌ Error en /api/paradas:', error);
    res.status(500).json({ success: false, message: 'Error al guardar parada.' });
  }
});

app.get('/api/paradas', async (req, res) => {
  try {
    const paradas = await Parada.find().sort({ FECHA: -1 });
    const formateadas = paradas.map(p => ({
      ...p.toObject(),
      FECHA: p.FECHA.toISOString().split('T')[0]
    }));
    res.json(formateadas);
  } catch (error) {
    console.error('❌ Error al obtener paradas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener paradas.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mq4.html'));
});


app.post('/api/maquinas', async (req, res) => {
  try {

    console.log('📥 Datos recibidos:', req.body);
    const { SUPERVISOR,REFERENCIA,CANTIDAD,CANTIDAD_H,CANTIDAD_C,CANTIDAD_A,ESTANTERIA_D, FECHA_INICIAL, FECHA_FINAL, TIEMPO_PRODUCCION, TIEMPO_PARADA } = req.body;

    const nuevaMaquina = new Maquina({
      SUPERVISOR,
      REFERENCIA,
      CANTIDAD,
      CANTIDAD_H,
      CANTIDAD_C,
      CANTIDAD_A,
      ESTANTERIA_D,
      FECHA_INICIAL: new Date(FECHA_INICIAL),
      FECHA_FINAL: new Date(FECHA_FINAL),
      TIEMPO_PRODUCCION,
      TIEMPO_PARADA
    });

    await nuevaMaquina.save();
    res.status(201).json({ success: true, message: 'Registro guardado en máquina 4' });
  } catch (err) {
    console.error('❌ Error al guardar máquina 4:', err);
    res.status(500).json({ success: false, message: 'Error al guardar máquina 4' });
  }
});


app.get('/api/maquinas', async (req, res) => {
  try {
    const maquinas = await Maquina.find().sort({ FECHA_INICIAL: -1 });
    res.json(maquinas);
  } catch (error) {
    console.error('❌ Error al obtener datos de máquina:', error);
    res.status(500).json({ success: false, message: 'Error al obtener datos.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  await actualizarRoturaEnVagonetas();
  await limpiarDatosInvalidos(); 
});

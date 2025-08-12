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
  SUPERVISOR: { type: String, required: true },
  REFERENCIA: { type: String, required: true },
  CANTIDAD: { type: Number, required: true },
  CANTIDAD_H: { type: Number, required: true },
  CANTIDAD_C: { type: Number, required: true },
  CANTIDAD_A: { type: Number, required: true },
  FECHA_INICIAL: { type: Date, required: true },
  FECHA_FINAL: { type: Date, required: true },
  TIEMPO_PRODUCCION: { type: Number, required: true },
  TIEMPO_PARADA: { type: Number, required: true },
  ESTANTERIAMQ: { type: Number, required: true },

  CANTIDAD_V_A_A: { type: Number, required: true },
  CANTIDAD_V_M_A: { type: Number, required: true },
  CARPAS: { type: Number, required: true },
  IMPULSOS: { type: Number, required: true },
  CANTIDAD_V_A_D: { type: Number, required: true },
  CANTIDAD_V_M_D: { type: Number, required: true },

  comentarios: [
    {
      numero: { type: Number, required: true },
      texto: { type: String, required: true, minlength: 10, maxlength: 1700 },
      fecha: { type: Date, default: Date.now }
    }
  ],

  FIRMA: { type: String, required: true }
});

const Maquina = mongoose.model("Maquina", maquinaSchema);



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


// 📌 POST - Crear registro nuevo
app.post("/api/maquina", async (req, res) => {
  try {
    const nuevaMaquina = new Maquina({
      SUPERVISOR: req.body.SUPERVISOR,
      REFERENCIA: req.body.REFERENCIA,
      CANTIDAD: req.body.CANTIDAD,
      CANTIDAD_H: req.body.CANTIDAD_H,
      CANTIDAD_C: req.body.CANTIDAD_C,
      CANTIDAD_A: req.body.CANTIDAD_A,
      FECHA_INICIAL: req.body.FECHA_INICIAL,
      FECHA_FINAL: req.body.FECHA_FINAL,
      TIEMPO_PRODUCCION: req.body.TIEMPO_PRODUCCION,
      TIEMPO_PARADA: req.body.TIEMPO_PARADA,
      ESTANTERIAMQ: req.body.ESTANTERIAMQ,
      CANTIDAD_V_A_A: req.body.CANTIDAD_V_A_A,
      CANTIDAD_V_M_A: req.body.CANTIDAD_V_M_A,
      CARPAS: req.body.CARPAS,
      IMPULSOS: req.body.IMPULSOS,
      CANTIDAD_V_A_D: req.body.CANTIDAD_V_A_D,
      CANTIDAD_V_M_D: req.body.CANTIDAD_V_M_D,
      comentarios: [
        {
          numero: 1,
          texto: req.body.COMENTARIO
        }
      ],
      FIRMA: req.body.FIRMA
    });

    await nuevaMaquina.save();
    res.status(201).json({ message: "Registro creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al guardar el registro" });
  }
});


// 📌 PUT - Agregar nuevo comentario al mismo documento
app.put("/api/maquina/:id/comentario", async (req, res) => {
  try {
    const maquina = await Maquina.findById(req.params.id);
    if (!maquina) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    // Calcular número de comentario
    const nuevoNumero = maquina.comentarios.length + 1;

    maquina.comentarios.push({
      numero: nuevoNumero,
      texto: req.body.texto
    });

    await maquina.save();
    res.json({ message: "Comentario agregado correctamente", maquina });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agregar el comentario" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  await actualizarRoturaEnVagonetas();
  await limpiarDatosInvalidos(); 
  console.log("🌐 Base de datos usada:", mongoose.connection.name); // <-- ESTO
  console.log("🧩 URI conectada:", mongoose.connection.client.s.url); // <-- Y ESTO
});


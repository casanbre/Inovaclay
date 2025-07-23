require('dotenv').config();
const mongoose = require('mongoose');

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Modelo CuartoSecado (puedes importar si ya está definido en otro archivo)
const cuartoSchema = new mongoose.Schema({
  cuarto: Number,
  horaInicio: Date,
  horaCierre: Date,
  horaFinal: Date,
  duracionIngreso: Number,
  duracionTotal: Number,
  completado: Boolean
});
const CuartoSecado = mongoose.model('CuartoSecado', cuartoSchema);

// Función para ajustar fechas
async function corregirFechas() {
  try {
    const cuartos = await CuartoSecado.find();

    for (const cuarto of cuartos) {
      let modificado = false;

      const campos = ['horaInicio', 'horaCierre', 'horaFinal'];

      for (const campo of campos) {
        if (cuarto[campo] instanceof Date) {
          // Corrige desfase de zona horaria: -5 horas
          cuarto[campo] = new Date(cuarto[campo].getTime() - 5 * 60 * 60 * 1000);
          modificado = true;
        }
      }

      // Recalcula duraciones
      if (cuarto.horaInicio && cuarto.horaCierre) {
        cuarto.duracionIngreso = Math.floor((cuarto.horaCierre - cuarto.horaInicio) / 60000);
        modificado = true;
      }
      if (cuarto.horaInicio && cuarto.horaFinal) {
        cuarto.duracionTotal = Math.floor((cuarto.horaFinal - cuarto.horaInicio) / 60000);
        modificado = true;
      }

      if (modificado) {
        await cuarto.save();
      }
    }

    console.log('✅ Fechas corregidas.');
    process.exit();
  } catch (err) {
    console.error('❌ Error al corregir fechas:', err);
    process.exit(1);
  }
}

corregirFechas();

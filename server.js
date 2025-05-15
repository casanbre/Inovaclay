const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/api/data", async (req, res) => {
  try {
    const response = await axios.get("http://laclay.great-site.net/datos.php"); // <-- Cambia este link
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("¡API funcionando correctamente!");
});
app.listen(PORT, () => console.log(`Servidor proxy escuchando en puerto ${PORT}`));

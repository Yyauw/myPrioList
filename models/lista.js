const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  prioridad: {
    type: String,
    enum: ["Opcional", "Por Hacer", "URGENTE"],
  },
  tareas: [{ type: mongoose.Schema.Types.ObjectId, ref: "tareas" }],
});

const lista = mongoose.model("listas", listSchema);

module.exports = lista;

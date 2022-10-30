const mongoose = require("mongoose");

const tareasSchema = new mongoose.Schema({
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
});

const tareas = mongoose.model("tareas", tareasSchema);

module.exports = tareas;

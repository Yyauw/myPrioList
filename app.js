const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const lista = require("./models/lista");
const tareas = require("./models/tareas");
const methodOverride = require("method-override");
const { findById } = require("./models/tareas");

const prio = ["Opcional", "Por Hacer", "URGENTE"];
//"mongodb://localhost:27017/myPrioList"
const urldb = process.env.mdbport || "mongodb://localhost:27017/myPrioList"
mongoose
  .connect(urldb)
  .then(() => {
    console.log("SIUUUUUUUU");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.static("public"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/home", (req, res) => {
  res.redirect("/");
});

//para recibir solicitudes POST
app.use(express.urlencoded({ extended: true }));

//vizualizar toda las listas
app.get("/mylists", async (req, res) => {
  const lista2 = await lista.find({});
  res.render("myList", { lista2 });
});

//agregar nueva lista
app.post("/mylists", async (req, res) => {
  const { dtlista } = req.body;
  const nuevalista = new lista(dtlista);
  await nuevalista.save();
  res.redirect("/mylists");
});

//mostrar mas informacion de las listas
app.get("/mylists/:id", async (req, res) => {
  const { id } = req.params;
  const lista2 = await lista.findById(id).populate("tareas");
  res.render("show", { lista2 });
});

//Crear nueva tarea dentro de la lista
app.get("/mylists/:id/newtask", async (req, res) => {
  const { id } = req.params;
  const lista2 = await lista.findById(id);
  res.render("newtask", { lista2, prio });
});

//editar tareas
app.get("/mylists/:id/:taskid/edittask", async (req, res) => {
  const { id, taskid } = req.params;
  const tarea2 = await tareas.findById(taskid);
  res.render("taskedit", { tarea2, prio, id });
});

//entrar a editar lista
app.get("/mylists/:id/edit", async (req, res) => {
  const { id } = req.params;
  const lista2 = await lista.findById(id);
  res.render("edit", { lista2, prio });
});

//agregar nueva tarea
app.post("/mylists/:id", async (req, res) => {
  const { dttarea } = req.body;
  const { id } = req.params;
  const nuevatarea = new tareas(dttarea);
  await nuevatarea.save();
  const listaselec = await lista.findById(id);
  listaselec.tareas.push(nuevatarea);
  listaselec.save();
  res.redirect("/mylists/" + id);
});

//borrar tarea
app.delete("/mylists/:id/:taskid", async (req, res) => {
  const { id, taskid } = req.params;
  await lista.findByIdAndUpdate(
    id,
    { $pull: { tareas: taskid } },
    { multi: true }
  );
  await tareas.findByIdAndDelete(taskid);

  res.redirect("/mylists/" + id);
});

//Borrar lista
app.delete("/mylists/:id", async (req, res) => {
  const { id } = req.params;
  const datolista = await lista.findById(id);
  for (const dtos of datolista.tareas) {
    await tareas.findByIdAndDelete(dtos._id);
  }
  await lista.findByIdAndDelete(id);
  res.redirect("/mylists");
});

//editar lista
app.put("/mylists/:id", async (req, res) => {
  const { id } = req.params;
  const { dtlista } = req.body;
  await lista.findByIdAndUpdate(id, dtlista);
  res.redirect("/mylists");
});

//marcar tarea como hecha
app.get("/mylists/:id/:taskid", async (req, res) => {
  const { id, taskid } = req.params;
  const tarea1 = await tareas.findById(taskid);
  tarea1.prioridad !== "Hecho"
    ? await tareas.findByIdAndUpdate(taskid, { prioridad: "Hecho" })
    : await tareas.findByIdAndUpdate(taskid, { prioridad: "Por Hacer" });

  res.redirect("/mylists/" + id);
});

app.put("/mylists/:id/:taskid", async (req, res) => {
  const { id, taskid } = req.params;
  const { dttarea } = req.body;
  await tareas.findByIdAndUpdate(taskid, dttarea);
  res.redirect("/mylists/" + id);
});

//crear nueva lista
app.get("/newlist", (req, res) => {
  res.render("newList");
});

app.get("*", (req, res) => {
  res.render("pageNotFound");
});

const porth = process.env.PORT || 3000

app.listen(porth, () => {
  console.log("Listening on port 3000!");
});

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const lista = require("./models/lista");
const methodOverride = require("method-override");

mongoose
  .connect("mongodb://localhost:27017/myPrioList")
  .then(() => {
    console.log("SIUUUUUUUU");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
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
  const lista2 = await lista.findById(id);
  res.render("show", { lista2 });
});

app.delete("/mylists/:id", async (req, res) => {
  const { id } = req.params;
  await lista.findByIdAndDelete(id);
  res.redirect("/mylists");
});

//crear nueva lista
app.get("/newlist", (req, res) => {
  res.render("newList");
});

app.get("*", (req, res) => {
  res.render("pageNotFound");
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});

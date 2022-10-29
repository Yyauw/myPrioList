const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const lista = require("./models/lista");

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

app.get("/", (req, res) => {
  res.render("home");
});

//para recibir solicitudes POST
app.use(express.urlencoded({ extended: true }));

//vizualizar toda las listas
app.get("/mylists", async (req, res) => {
  const lista2 = await lista.find({});
  console.log(lista2);
  res.render("myList", { lista2 });
});

//agregar nueva lista
app.post("/mylists", (req, res) => {
  const { dtlista } = req.body;
  const nuevalista = new lista(dtlista);
  nuevalista.save();
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

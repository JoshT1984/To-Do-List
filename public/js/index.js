const express = require("express");
const app = express();
const path = require("path");
const date = require(__dirname + "/date.js");
const { v4: uuid } = require("uuid");
const methodOverride = require("method-override");

let newItems = [];

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../../views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "../../../public")));

app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  let today = date.newDate();
  res.render("index", { currentDay: today, newListItem: newItems });
});

app.get("/new", (req, res) => {
  let today = date.newDate();
  res.render("new", { today });
});

app.post("/", (req, res) => {
  let item = req.body.listItem;
  let uniqueID = uuid();
  newItems.push({ addItem: item, id: uniqueID });
  res.redirect("/");
});

app.get("/:id", (req, res) => {
  const { id } = req.params;
  const itemID = newItems.find((i) => i.id === id);

  if (itemID) {
    res.render("show", { itemID });
  }
});

app.get("/:id/edit", (req, res) => {
  const { id } = req.params;
  const itemID = newItems.find((i) => i.id === id);
  if (itemID) {
    app.use(express.static(path.join(__dirname + itemID + "../../../public")));
    res.render("edit", { itemID });
  }
});

app.patch("/:id", (req, res) => {
  const { id } = req.params;
  const newItemText = req.body.item;
  const foundItem = newItems.find((i) => i.id === id);
  foundItem.addItem = newItemText;
  res.redirect("/");
});

app.delete("/:id", (req, res) => {
  const { id } = req.params;
  newItems = newItems.filter((i) => i.id !== id);
  res.redirect("/");
});

app.listen(process.env.PORT|| 3000, () => {
  console.log("Listening on port 3000");
});

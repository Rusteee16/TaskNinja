//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/taskninja", { useNewUrlParser: true }).then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

let todolist;
let notes;

const itemsSchema = {
  name: String
};

const notesSchema = {
    title: String,
    text: String
};

const Item = mongoose.model(
  "Item",
  itemsSchema
);

const Note = mongoose.model(
    "Notes",
    notesSchema
);

const item1 = new Item({
  name:"Welcome."
});

const item2 = new Item({
  name:"Hit + to add."
});

const item3 = new Item({
  name:"<-- Hit this to delete."
});

const defaultItems = [item1,item2,item3];

// app.use(function(req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//   res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
//   next();
// });

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  if ('OPTIONS' === req.method) {
  res.sendStatus(200);
  } else {
    next();
  }
});

app.get("/todolist", function(req, res) {
  Item.find({}).then(function(foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defaultItems)
        .then(function () {
            todolist = defaultItems;
            res.json(todolist);
            console.log("Successfully saved defult items to DB");
        })
        .catch(function (err) {
          console.log(err);
        });
    }else{
      todolist = foundItems;
      res.json(todolist);
    }
  })
  .catch(function(err){
    console.log(err);
  });
});

app.get("/notes", function(req, res) {
  Note.find({}).then(function(foundNotes){
    notes = foundNotes;
    res.json(notes);
  })
  .catch(function(err){
    console.log(err);
  });
});

app.post("/addtodolist", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();
  res.json(item);
});

app.post("/addnotes", function(req, res){

  const notesTitle = req.body.newText.title;

  const notesText = req.body.newText.content;

  const note = new Note({
    title: notesTitle,
    text: notesText
  });

  note.save();
  res.json(note);
});

app.post("/deleteitem", function(req, res){
  Item.findByIdAndRemove({_id: req.body.itemId})
  .then(function () {
    res.json(todolist);
  })
  .catch(function (err) {
    console.log(err);
  });
});

app.post("/deletenote", function(req, res){
  Note.findByIdAndRemove({_id: req.body.id})
  .then(function () {
    res.json(notes);
  })
  .catch(function (err) {
    console.log(err);
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

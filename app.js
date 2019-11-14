const express  = require("express"),
      mongoose = require("mongoose"),
      app      = express(),
      port     = 3000;


//Mongoose setup:
mongoose.connect("mongodb://localhost", {useNewUrlParser: true});


// routes, for now
app.get("/", (req, res) => res.send("Hi"));

//Hello, GitHub Again


app.listen(port, () => console.log("server up"))
const express  = require("express"),
      mongoose = require("mongoose"),
      app      = express(),
      port     = 5500;

const Competency = require("./models/Competency"),
      Skill      = require("./models/Skill"),
      Role       = require("./models/Role"),
      seedDB     = require("./seedDb");
    //   testDB     = require("./test");

//Mongoose setup:
//mongodb://localhost/CompetencyTracker
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true});
seedDB();
// routes, for now
app.get("/", (req, res) => res.send("Hi"));
app.get("/test", (req, res) => {
    res.send("This is the test page")
})

//Hello, GitHub Again


app.listen(port, () => console.log("server up"))
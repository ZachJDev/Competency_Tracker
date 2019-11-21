const express  = require("express"),
      mongoose = require("mongoose"),
      app      = express(),
      port     = 5500;

const Competency = require("./models/Competency"),
      Skill      = require("./models/Skill"),
      Role       = require("./models/Role"),
      seedDB     = require("./seedDb");
    //   testDB     = require("./test");

const competencyRoutes = require("./routes/Competencies"),
      roleRoutes       = require("./routes/Roles");


//Mongoose setup:
//mongodb://localhost/CompetencyTracker
mongoose.connect("mongodb://localhost/CompetencyTracker", {useNewUrlParser: true, useUnifiedTopology: true});
seedDB();

//express setup
app.use("/roles", roleRoutes);
app.use("/competencies", competencyRoutes);

// routes, for now
app.get("/", (req, res) => res.send("Hi"));


app.listen(port, () => console.log("server up"))
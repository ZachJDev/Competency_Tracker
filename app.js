const express  = require("express"),
      mongoose = require("mongoose"),
      request = require("request"),
      bodyParser = require("body-parser"),
      app      = express(),
      port     = 5500;

const Competency = require("./models/Competency"),
      Role       = require("./models/Role"),
      seedDB     = require("./seedDb");
    

app.use(bodyParser.urlencoded({extended: true})); //This has to be BEFORE the routes. 
//routes
const competencyRoutes = require("./routes/Competencies"),
      skillRoutes      = require("./routes/Skills"),
      roleRoutes       = require("./routes/Roles");


//Mongoose setup:
//mongodb://localhost/CompetencyTracker
mongoose.connect("mongodb://localhost/CompetencyTracker", {useNewUrlParser: true, useUnifiedTopology: true});
seedDB();

//express setup
app.use("/roles", roleRoutes);
app.use("/competencies", competencyRoutes);
app.use("/competencies/:id/skill", skillRoutes)

app.set("view engine", "ejs");

// routes, for now
app.get("/", (req, res) => res.send("Hi"));


app.listen(port, () => console.log("server up"))
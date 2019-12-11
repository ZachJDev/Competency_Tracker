const express = require("express"),
  mongoose = require("mongoose"),
  request = require("request"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  app = express(),
  port = 5500;

const Competency = require("./models/Competency"),
  DeletedCompetencyCounter = require("./models/DeletedCompetencyCounter"),
  Role = require("./models/Role"),
  seedDB = require("./seedDb");

app.use(methodOverride('_method'))


app.use(bodyParser.urlencoded({ extended: true })); //This has to be BEFORE the routes.
//routes
const competencyRoutes = require("./routes/Competencies"),
  skillRoutes = require("./routes/Skills"),
  roleRoutes = require("./routes/Roles"),
  indexRoutes = require("./routes/index"),
  subSkillRoutes = require("./routes/subSkills");

//Mongoose setup:
//mongodb://localhost/CompetencyTracker
mongoose.connect("mongodb://localhost/CompetencyTracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
seedDB();

//express setup
app.use("/", indexRoutes);
app.use("/roles", roleRoutes);
app.use("/competencies", competencyRoutes);
app.use("/competencies/:id/skills", skillRoutes);
app.use("/competencies/:id/skills/:skill_id/subskills", subSkillRoutes);
app.set("view engine", "ejs");

app.listen(port, () => console.log("server up"));

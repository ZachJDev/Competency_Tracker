const express = require("express"),
  mongoose = require("mongoose"),
  request = require("request"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  ENV = require("./env"),
  app = express(),
  port = 5500;

const Skill = require("./models/Skill"),
  Competency = require("./models/Competency"),
  DeletedCompetencyCounter = require("./models/DeletedCompetencyCounter"),
  Role = require("./models/Role"),
  seedDB = require("./seedDb");

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({ extended: true })); //This has to be BEFORE the routes.
//routes
const competencyRoutes = require("./routes/Competencies"),
  skillRoutes = require("./routes/Skills"),
  roleRoutes = require("./routes/Roles"),
  indexRoutes = require("./routes/index"),
  subSkillRoutes = require("./routes/subSkills");

//Mongoose setup:
//mongodb://localhost/CompetencyTracker
//I've been having troubling keeing environmental variables straight between my computers, so until this is hosted anywhere, mongoose will stay connected like this.
mongoose.connect(ENV.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// seedDB();

//express setup
app.use("/", indexRoutes);
app.use("/roles", roleRoutes);
app.use("/competencies", competencyRoutes);
app.use("/competencies/:id/skills", skillRoutes);
app.use("/competencies/:id/skills/:skill_id/subskills", subSkillRoutes);
app.set("view engine", "ejs");
app.use(express.static(__dirname + '\\public'));
app.listen(process.env.PORT || port, () => console.log("server up"));

const express    = require("express"),
      router     = express.Router(),
      Role       = require("../models/Role.js"),
      Competency = require("../models/Competency.js"),
      Skill      = require("../models/Skill.js");

//roles routes
//index
router.get("/", (req, res) => res.send("This is the Roles READ route"));
//New
router.get("/new", (req, res) => res.send("This is the Roles NEW route"));
//Create
router.post("/", (req, res) => res.send("This is the Roles CREATE route"));
//Show
router.get("/:id", (req, res) => res.send("This is the Roles SHOW route"));
//Edit
router.get("/:id/edit", (req, res) => res.send("This is the Roles EDIT route"));
//Update
router.put("/:id",(req, res) => res.send("This is the Roles UPDATE route"));
//Destroy
router.delete("/:id", (req, res) => res.send("This is the Roles DESTROY route"));


module.exports = router;
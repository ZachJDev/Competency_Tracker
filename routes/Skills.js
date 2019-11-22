const express    = require("express"),
      router     = express.Router(),
      Role       = require("../models/Role.js"),
      Competency = require("../models/Competency.js");

//Skill routes
//New
router.get("/new", (req, res) => res.send("This is the Skill NEW route"));
//Create
router.post("/", (req, res) => res.send("This is the Skill CREATE route"));
//Edit
router.get("/:id/edit", (req, res) => res.send("This is the Skill EDIT route"));
//Update
router.put("/:id",(req, res) => res.send("This is the Skill UPDATE route"));
//Destroy
router.delete("/:id", (req, res) => res.send("This is the Skill DESTROY route"));


module.exports = router
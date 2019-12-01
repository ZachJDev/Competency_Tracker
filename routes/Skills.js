const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Role = require("../models/Role.js"),
  Competency = require("../models/Competency.js");

//Skill routes
//New
router.get("/new", (req, res) => {
  Competency.findById(req.params.id, (err, competency) => {
    if (err) {
      console.log(err);
    } else {
      res.render("../views/skills/new", {
        competency: competency,
        count: competency.skills.length
      });
    }
  });
});
//Create
router.post("/", (req, res) => {
  // a different way of accessing the information than the subskill. I want to see the visual difference each made.
  newSkill = {
    name: req.body.name,
    description: req.body.description,
    number: req.body.number
  };
  Competency.findById(req.params.id, (err, competency) => {
    if (err) {
      console.log(err);
    } else {
      competency.skills.push(newSkill);
      competency.save();
      res.redirect("/competencies");
    }
  });
});

//Edit
router.get("/:id/edit", (req, res) => res.send("This is the Skill EDIT route"));
//Update
router.put("/:id", (req, res) => res.send("This is the Skill UPDATE route"));
//Destroy
router.delete("/:id", (req, res) =>
  res.send("This is the Skill DESTROY route")
);

module.exports = router;

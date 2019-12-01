const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Role = require("../models/Role.js"),
  Competency = require("../models/Competency.js");

//New
router.get("/new", (req, res) => {
  Competency.findById(req.params.id, (err, competency) => {
    if (err) {
      console.log(err);
    } else {
      const skill = competency.skills.id(req.params.skill_id);

      res.render("../views/subskills/new", {
        skill: skill,
        competency: competency,
        count: skill.subSkills.length
      });
    }
  });
});

//Create
router.post("/", (req, res) => {
  Competency.findById(req.params.id, (err, competency) => {
    if (err) {
      console.log(err);
    } else {
      const skill = competency.skills.id(req.params.skill_id);
      skill.subSkills.push({
        name: req.body.name,
        number: req.body.number,
        description: req.body.description
      });
      competency.save();
      res.redirect("/competencies");
    }
  });
});
//Edit
router.get("/:subskill_id/edit", (req, res) =>
  res.send("This is the Skill EDIT route")
);
//Update
router.put("/:subskill_id", (req, res) =>
  res.send("This is the Skill UPDATE route")
);
//Destroy
router.delete("/:subskill_id", (req, res) =>
  res.send("This is the Skill DESTROY route")
);
module.exports = router;

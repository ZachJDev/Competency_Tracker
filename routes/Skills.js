const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Role = require("../models/Role.js"),
  Competency = require("../models/Competency.js");

//NEW SOLUTION TO MY DELTED COMPETENCIES AND SKILLS PROBLEM:
//create a list of deleted skills/comps in model (same place
//as the counter arrays are now.
//push() any deleted items on to there.
//when creating a new skill/comp, check if that array is empty.
//if so, count = length + 1,
//if not, count = .unshift()ed number,
//indexOf() the number before it, and splice the new skill there
//hopefully Mongoose has special sorting so my competencies don't get out of order...

function findSkillCount(competency) {
  if (competency.skillsArray.length == 0) {
    //check if this is the first skill added
    return 0;
  } else {
    let skillsArray = competency.skillsArray; //these next two assignments are for readability, but I don't really know if they need to be done.
    let length = skillsArray.length;
    if (length != skillsArray[length - 1]) {
      // if a skill has been deleted, this should return the number of the deleted skill.
      for (i = 0; i < length; i++) {
        if (skillsArray[i] != i + 1) {
          return i + 1;
        }
      }
    }
    return length;
  }
}
//Skill routes
//New
router.get("/new", (req, res) => {
  var count;
  Competency.findById(req.params.id, (err, competency) => {
    if (err) {
      console.log(err);
    } else {
      console.log(competency.skillsArray);
      count = findSkillCount(competency);
      console.log(
        `sending count ${count} to new page skills Array is ${competency.skillsArray}`
      );
      res.render("../views/skills/new", {
        competency: competency,
        count: count
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
      console.log("from the POST route number should be: " + newSkill.number);
      competency.skills.push(newSkill);
      competency.skillsArray.push(newSkill.number);
      competency.save().then(res.redirect("/competencies"));
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

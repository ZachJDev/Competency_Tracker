const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Role = require("../models/Role.js"),
  Skill = require("../models/Skill");
Competency = require("../models/Competency.js");

function findInsertionIndex(number, skillNumbers) {
  //I'll need to rewrite this as a for loop if i don't want it to iterate through the entire array.
  //and of course I should also refactor this and the same function for skills into one spot.
  let newIndex = 0;
  skillNumbers.forEach((el, index, array) => {
    if (number > array[index].number && number < array[index + 1].number) {
      newIndex = index + 1;
    }
  });
  return newIndex;
}

//New
router.get("/new", (req, res) => {
  Competency.findById(req.params.id).then(competency => {
    let sendCompetency = competency;
    Skill.findById(req.params.skill_id).then(skill => {
      let sendSkill = skill;
      let count = skill.deletedSubSkills.length
        ? skill.deletedSubSkills.shift()
        : skill.subSkills.length + 1;
      skill.save();
      res.render("../views/subskills/new", {
        count: count,
        competency: sendCompetency,
        skill: sendSkill
      });
    });
  });
});

//Create
router.post("/", (req, res) => {
  let newSubSkill = {
    number: req.body.number,
    name: req.body.name
  };
  Skill.findById(req.params.skill_id).then(skill => {
    let subSkills = skill.subSkills;
    if (subSkills.length) {
      if (newSubSkill.number < subSkills[0].number) {
        //insert at front
        skill.subSkills.splice(0, 0, newSubSkill);
        skill.save().then(res.redirect("/competencies"));
      } else if (newSubSkill.number > subSkills[subSkills.length - 1].number) {
        //insert at back (combine with the outer else?)
        skill.subSkills.push(newSubSkill);
        skill.save().then(res.redirect("/competencies"));
      } else {
        //insert in the middle
        const newIndex = findInsertionIndex(newSubSkill.number, subSkills);
        skill.subSkills.splice(newIndex, 0, newSubSkill);
        console.log(skill.subSkills);
        skill.save().then(res.redirect("/competencies"));
      }
    } else {
      //when there are no
      skill.subSkills.push(newSubSkill);
      skill.save().then(res.redirect("/competencies"));
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
router.delete("/:subskill_id", (req, res) => {
  Skill.findById(req.params.skill_id).then(skill => {
    //I feel like all of these nested .then()s might miss the point of doing them. OR I'm using them correctly, and it's just what one has to do to do nested asychronous calls.
    let subSkill = skill.subSkills.id(req.params.subskill_id);
    let subSkillIndex = skill.subSkills.findIndex(
      element => element == subSkill
    );
    skill.subSkills.splice(subSkillIndex, 1);
    skill.deletedSubSkills.push(subSkill.number);
    //I need to write a sort function that works with numbers and not strings.
    console.log(subSkillIndex);
    skill.save().then(res.redirect("/competencies"));
  });
});

module.exports = router;

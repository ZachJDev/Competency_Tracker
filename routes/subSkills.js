const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Role = require("../models/Role.js"),
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
  Competency.findById(req.params.id, (err, competency) => {
    if (err) {
      console.log(err);
    } else {
      const skill = competency.skills.id(req.params.skill_id);
      console.log(skill.deletedSubSkills);
      if (skill.deletedSubSkills.length) {
        let count = skill.deletedSubSkills.shift();
        console.log(count);
        skill.save().then(
          competency.save().then(
            // trying to unduplicate this code is proving harder than I expected.
            res.render("../views/subskills/new", {
              skill: skill,
              competency: competency,
              count: count
            })
          )
        );
      } else {
        res.render("../views/subskills/new", {
          skill: skill,
          competency: competency,
          count: skill.subSkills.length + 1
        });
      }
    }
  });
});

//Create
router.post("/", (req, res) => {
  let newSubSkill = {
    number: req.body.number,
    name: req.body.name
  };
  Competency.findById(req.params.id, (err, competency) => {
    if (err) {
      console.log(err);
    } else {
      const skill = competency.skills.id(req.params.skill_id);
      skillNumbers = skill.subSkills.map((obj, index) => {
        newObject = {};
        newObject.number = obj.number;
        newObject.index = index;
        return newObject;
      });

      if (skillNumbers.length) {
        if (newSubSkill.number < skillNumbers[0].number) {
          //insert at front
          skill.subSkills.splice(0, 0, newSubSkill);
          competency.save().then(res.redirect("/competencies"));
        } else if (
          newSubSkill.number > skillNumbers[skillNumbers.length - 1].number
        ) {
          //insert at back (combine with the outer else?)
          skill.subSkills.push(newSubSkill);
          competency.save().then(res.redirect("/competencies"));
        } else {
          //insert in the middle
          newIndex = findInsertionIndex(newSubSkill.number, skillNumbers);
          skill.subSkills.splice(newIndex, 0, newSubSkill);
          console.log(skill.subSkills);
          competency.save().then(res.redirect("/competencies"));
        }
      } else {
        //when there are no
        skill.subSkills.push(newSubSkill);
        competency.save().then(res.redirect("/competencies"));
      }
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
  let findCompetency = Competency.findById(req.params.id);
  let findSkill = findCompetency.then(competency => {
    // console.log(competency);
    let skill = competency.skills.id(req.params.skill_id);
    // console.log(skill);
    let subSkill = skill.subSkills.id(req.params.subskill_id);
   let subSkillIndex = skill.subSkills.findIndex((element) => element == subSkill);
   skill.subSkills.splice(subSkillIndex, 1);
   skill.deletedSubSkills.push(subSkill.number);
   //I need to write a sort function that works with numbers and not strings.
    console.log(subSkillIndex)
    competency.save();
  });
  findSkill.then(res.redirect("/competencies"));
});
module.exports = router;

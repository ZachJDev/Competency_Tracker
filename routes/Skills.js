const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Role = require("../models/Role.js"),
  Skill = require("../models/Skill.js");
Competency = require("../models/Competency.js");

//Skill routes
//New
router.get("/new", (req, res) => {
  var count;
  Competency.findById(req.params.id, (err, competency) => {
    if (err) {
      console.log(err);
    } else {
      console.log(competency.deletedSkills);
      if (competency.deletedSkills.length) {
        //if truthy; if there are items in deletedSkills
        //THIS NEEDS TO HAPPEN AFTER THE  NEW SKILL HAS BEEN SAVED. RIGHT NOW, HITTING 'BACK' ON THE NEW FORM WILL MESS UP THE ORDERING
        count = competency.deletedSkills.shift();
        competency.save().then(
          // trying to unduplicate this code is proving harder than I expected.
          res.render("../views/skills/new", {
            competency: competency,
            count: count
          })
        );
      } else {
        count = competency.skills.length + 1;
        res.render("../views/skills/new", {
          competency: competency,
          count: count
        });
      }
    }
  });
});

//Create
router.post("/", (req, res) => {
  let newSkill = {
    name: req.body.name,
    number: req.body.number
  };
  Skill.create(newSkill)
    .then(skill => {
      Competency.findById(req.params.id, (err, competency) => {
        if (err) {
          console.log(err);
        } else {
          competency.skills.push(skill._id);
          competency.save();
        }
      });
    })
    .then(res.redirect("/competencies"));
});

//Edit
router.get("/:skill_id/edit", (req, res) =>
  res.send("This is the Skill EDIT route")
);
//Update
router.put("/:skill_id", (req, res) =>
  res.send("This is the Skill UPDATE route")
);
//Destroy
router.delete("/:skill_id", (req, res) => {
  let skillNumber;
  Skill.findById(req.params.skill_id).then(skill => {
    skillNumber = skill.number;
    Competency.findById(req.params.id).then(competency => {
      let deletedSkills = competency.deletedSkills;
      deletedSkills.push(skillNumber); // I need to sort this array here too.
      deletedSkills.sort((a, b) => a - b); // this should always put the lowest number in the first position.
      skillIndex = competency.skills.indexOf(req.params.skill_id);
      competency.skills.splice(skillIndex, 1);
      competency.save().then(
        Role.find({
          competenciesAndSkills: { $elemMatch: { skills: req.params.skill_id } }
        })
          .populate({ path: "competenciesAndSkills.competency" })
          .populate({ path: "competenciesAndSkills.skills" })
          .then(roles => {
            console.log(roles);
            roles.forEach(role => {
              role.competenciesAndSkills.forEach((foundCompetency, index) => {
                if (foundCompetency.competency.name == competency.name) {
                  console.log(role.competenciesAndSkills[index]);
                  console.log(role.competenciesAndSkills[index].skills)
                  removalIndex = role.competenciesAndSkills[
                    index
                  ].skills.findIndex(element => element.name == skill.name);

                  role.competenciesAndSkills[index].skills.splice(removalIndex, 1);
                  role.save();
                }
              });
            });
            res.redirect("/competencies");
          })
      );
    });
  });
});
module.exports = router;

const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Role = require("../models/Role.js"),
  Competency = require("../models/Competency.js");

function findInsertionIndex(number, skillNumbers) {
  //I'll need to rewrite this as a for loop if i don't want it to iterate through the entire array.
  let newIndex = 0;
  skillNumbers.forEach((el, index, array) => {
    if (number > array[index].number && number < array[index + 1].number) { //check if number is between the current el and the next.
      newIndex = index + 1;
    }
  });
  return newIndex;
}
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
  Competency.findById(req.params.id, (err, competency) => {
    if (err) {
      console.log(err);
    } else {
      skillNumbers = competency.skills.map((obj, index) => {
        newObject = {};
        newObject.number = obj.number;
        newObject.index = index;
        return newObject;
      }); //returns an array of all the skill numbers. I think I can rewrite this all to just work  with the competency.skills array and not map a new one

      //WARNING VERY WET CODE TO FOLLOW

      if (skillNumbers.length) {
        //insert at end
        if (newSkill.number > skillNumbers[skillNumbers.length - 1].number) {
          competency.skills.push(newSkill);
          competency.save().then(res.redirect("/competencies"));
        }
        //insert at beginning
        else if (newSkill.number < skillNumbers[0].number) {
          console.log("in the pushtofront");
          updatedCompetency = Competency.updateOne(
            { _id: req.params.id },
            { $push: { skills: { $each: [newSkill], $position: 0 } } } //not sure why mongo requires $each for $position, but at least this works...
          );
          updatedCompetency.then(res.redirect("/competencies"));
        } //insert somewhere in the middle
        else {
          console.log("in the middle");
          newIndex = findInsertionIndex(newSkill.number, skillNumbers);
          console.log(newIndex);
          updatedCompetency = Competency.updateOne(
            { _id: req.params.id },
            { $push: { skills: { $each: [newSkill], $position: newIndex } } } //not sure why mongo requires $each for $position, but at least this works...
          );
          updatedCompetency.then(res.redirect("/competencies"));
        }
        // console.log(skillNumbers);
      } else {
        competency.skills.push(newSkill);
        competency.save().then(res.redirect("/competencies"));
      }
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

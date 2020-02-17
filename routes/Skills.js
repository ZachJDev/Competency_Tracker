const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Role = require("../models/Role.js"),
  Skill = require("../models/Skill.js"),
Competency = require("../models/Competency.js");

const middleware = require("./internal-modules/middleware")

//Skill routes
//New
router.get("/new", middleware.checkForCompetency, (req, res) => {
  var count;
  Competency.findById(req.params.id, (err, competency) => {
    try {
      if (err) {
        console.log(err);
      } else {
        if (competency.deletedSkills.length) {
          //if truthy; if there are items in deletedSkills
          count = competency.deletedSkills[0]  //competency.deletedSkills.shift() moved below
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
    } catch (err) {
      res.send("OOPS!"); // fix error handling
    }
  }).catch(err => {
    res.send("OOPS!"); // fix error handling
  });
});

//Create
router.post("/", middleware.checkForCompetency, (req, res) => {
  let newSkill = {
    name: req.body.name,
    number: req.body.number
  };
  Skill.create(newSkill).then(skill => {
    Competency.findByIdAndUpdate(
      req.params.id,
      { $push: { skills: skill }, $pop: {deletedSkills: -1} },
      { useFindAndModify: false }
    )
      .then(res.redirect("/competencies/" + req.params.id))
      .catch(err => {
        res.send("OOPS!"); // fix error handling
      });
  });
});

//Edit
router.get("/:skill_id/edit", middleware.checkForCompetency, middleware.checkForSkill, (req, res) =>
  Skill.findById(req.params.skill_id)
    .then(skill =>
      Competency.findById(req.params.id).then(competency =>
        res.render("skills/edit", { skill: skill, competency: competency })
      )
    )
    .catch(err => {
      res.send("OOPS"); // fix error handling
    })
);
//Update
router.put("/:skill_id", middleware.checkForCompetency, middleware.checkForSkill, (req, res) =>
  Skill.findByIdAndUpdate(
    req.params.skill_id,
    { $set: { name: req.body.name } },
    { useFindAndModify: false }
  )
    .then(res.redirect("/competencies/" + req.params.id))
    .catch(err => {
      res.send("OOPS!");
    })
);
//Destroy
/*OH my god....
I just realized that this code I wrote a month ago never actually DELETES the skill....
 */
router.delete("/:skill_id", middleware.checkForCompetency, middleware.checkForSkill, (req, res) => {
  let skillNumber;
  Skill.findById(req.params.skill_id)
    .then(skill => {
      skillNumber = skill.number;
      console.log(skillNumber);
      Competency.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { skills: skill._id },
          $push: { deletedSkills: { $each: [skillNumber], $sort: 1} }
        },
        { useFindAndModify: false }
      ).then(competency => {
        competency.save()
      });
      Role.updateMany(
        {
          competenciesAndSkills: {
            $elemMatch: { skills: req.params.skill_id }
          }
        },
        {
          $pull: {
            "competenciesAndskills.$[Skills].$": req.params.skill_id } //just realized that my capitalization is wrong and at this point I'm afdraid to fix it cause it works.
        },
        { useFindAndModify: false,
        arrayFilters: {skills: req.params._id} }
      )
        .then( result => {
          console.log(result)
          Skill.findByIdAndRemove(req.params.skill_id)
            .then(res.redirect("/competencies"))
            .catch(err => {
              console.log(err);
              res.send(err); // fix error handling
            })
          })
        .catch(err => {
          console.log(err);
          res.send(err); // fix error handling
        })
        .catch(err => {
          console.log(err);
          res.send(err); // fix error handling
        });
    })
    .catch(err => {
      console.log(err);
      res.send(err); // fix error handling
    });
});
module.exports = router;

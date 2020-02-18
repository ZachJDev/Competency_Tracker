const express = require("express"),
  router = express.Router({ mergeParams: true }),
  CompetenciesAndSkillsList = require("./internal-modules/Competencies-and-skillsObj.js"),
  Role = require("../models/Role.js"),
  Competency = require("../models/Competency.js");
//roles routes. uses "/roles"
//index
router.get("/", (req, res) => {
  Role.find({}) //I'll need stuff here once I implemenent different institutions and users
    .populate({ path: "competenciesAndSkills.competency" })
    .populate({ path: "competenciesAndSkills.skills" })
    .exec((err, allRoles) => {
      if (err) {
        res.send(err); // fix error handling
      } else {
        res.render("roles/index", { roles: allRoles });
      }
    });
});
//New
router.get("/new", (req, res) => {
  try {
    res.render("roles/new", { name: false, description: false });
  } catch (err) {
    //as to not mess up the ejs when opening the form for the first time. This would probably be better handled with cookies, but I don't know how to use those yet.
    res.send("OOPS!"); // fix error handling
  }
});
//Create
router.post("/", (req, res) => {
  const roleName = req.body.name;
  const roleDescription = req.body.description;
  try {
    let compInfo = new CompetenciesAndSkillsList(req.body.skills);
    compInfo.init().then(resolve => {
      Role.create({
        name: roleName,
        description: roleDescription,
        rawSkills: Array.from(compInfo.skillsSet),
        competenciesAndSkills: compInfo.skillIdsArray
      }).then(res.redirect("/roles"));
    });
  } catch (error) {
    console.log("Error When Creating Role");
    console.log(error);
    res.render("roles/new", { name: name, description: description });
  }
});

//Show
router.get("/:id", (req, res) => {
  Role.findById(req.params.id)
    .populate({ path: "competenciesAndSkills.competency" })
    .populate({ path: "competenciesAndSkills.skills" })
    .exec((err, role) => {
      if (err) {
        res.send("OOPS!"); // fix error handling;
      } else {
        res.render("roles/show", { role: role });
      }
    });
});
//Edit
router.get("/:id/edit", (req, res) => {
  Role.findById(req.params.id)
    .populate({ path: "competenciesAndSkills.competency" })
    .populate({ path: "competenciesAndSkills.skills" })
    .exec((err, role) => {
      if (err) {
        console.log(err);
      } else {
        res.render("roles/edit", { role: role });
      }
    });
});
//Update
router.put("/:id", (req, res) => {
  try {
    Role.findById(req.params.id)
      .then(role => {
        let oldSkills = new Set(role.rawSkills); //I don't think I need to be changing these from Array to Set back to Array....
        let newSkills = req.body.skills;
        let updateCompeteniesAndSkillsInfo = new CompetenciesAndSkillsList(
          newSkills,
          Array.from(oldSkills)
        );
        updateCompeteniesAndSkillsInfo.init().then(resolve => {
          role.competenciesAndSkills =
            updateCompeteniesAndSkillsInfo.skillIdsArray;
          role.rawSkills = Array.from(updateCompeteniesAndSkillsInfo.skillsSet);
          role
            .save()
            .then(res.redirect(`${req.params.id}/edit`))
            .catch(err => {
              res.send("OOPS!"); // fix error handling
            });
        });
      })
      .catch(err => {
        res.send("OOPS!"); // fix error handling
      });
  } catch (error) {
    res.send("OOPS!"); // fix error handling
  }
});

//route to remove skills and comps from roles
router.put("/:id/:thing/:thing_id", (req, res) => {
  let lookup = req.params.thing_id;
  var update = Role.findById(req.params.id).then(doc => {
    for (let i = 0; i < doc.competenciesAndSkills.length; i++) {
      if (req.params.thing === "skill") {
        let index = doc.competenciesAndSkills[i].skills.indexOf(lookup);
        if (index != -1) {
          doc.competenciesAndSkills[i].skills.splice(index, 1);
          break;
        }
      } else if (req.params.thing === "competency") {
        if (doc.competenciesAndSkills[i].competency == lookup) {
          doc.competenciesAndSkills.splice(i, 1);
          break;
        }
      }
    }
    doc.save();
  });
  update.then(res.redirect("/roles/" + req.params.id));
});

//Destroy
router.delete("/:id", (req, res) => {
  Role.findByIdAndDelete(req.params.id)
    .then((success, fail) => {
      if (success) {
        res.redirect("/roles");
      } 
    })
    .catch(err => {
      res.send("asdfsdf"); //fix error handling
    });
});

module.exports = router;

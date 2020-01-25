const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Role = require("../models/Role.js"),
  Competency = require("../models/Competency.js");

/* This whole function could use some TLC*/
//I really want to come back to this; it's VERY error-prone.
/* This function creates an object, where each key is a competency and each value is an array of specific skills. if 
a competency is added by itself, then the array will be a 0, and that will eventually tell the application to add all
skills from that competency.*/
function objectKeysToNumbers(object) {
  return Object.keys(object).map(key => Number(key));
}
function newObjectFromKeys(object, typeForValue = "none") {
  const typeDict = {
    array: [],
    string: "",
    number: 0,
    object: {},
    none: null
  };
  const defaultType = typeDict[typeForValue];
  let newObject = {};
  let keys = Object.keys(object);
  for (key of keys) {
    newObject[key] = defaultType;
  }
  return newObject;
}
function createSkillsMap(skills) {
  let competenciesAndSkills = {};
  let skillsArray = [];
  skills = skills.split(",");
  skills.forEach(skill => {
    splitSkills = skill.split("."); //this extra array makes sure that two or three digit competencies/skills will work too. those caused errors last time.
    skillsArray.push(splitSkills);
  });
  for (skill of skillsArray) {
    if (isNaN(skill[0])) continue;
    if (!competenciesAndSkills[skill[0]]) competenciesAndSkills[skill[0]] = [];
    if (skill[1] === undefined) competenciesAndSkills[skill[0]].push(0);
    //zero to keep NaNs out of my code. this will end up just pushing every skill.
    else {
      competenciesAndSkills[skill[0]].push(Number(skill[1]));
    }
  }
  return competenciesAndSkills;
}
async function findCompetencyIds(skillsObj) {
  let competencyIdsAndSkillNumbers = {};
  let competencyNumbers = objectKeysToNumbers(skillsObj);
  let promises = [];
  for (number of competencyNumbers) {
    promises.push(Competency.findOne({ number: number }, { number: 1 }));
  }
  const result = await Promise.all(promises);
  for (el of result) {
    if (el === null) continue;
    competencyIdsAndSkillNumbers[el._id] = skillsObj[el.number];
  }
  return competencyIdsAndSkillNumbers;
}


//this is insane. I'm literally just pushing this to document such strange behavior.

function findSkillIds(competenciesAndSkills) {
  let justCompetencyIds = Object.keys(competenciesAndSkills);
  let newCompetenciesObject = newObjectFromKeys(competenciesAndSkills, "array");
  let promises = [];
  for (let id of justCompetencyIds) {
    promises.push(Competency.findById(id).populate("skills"));
  }
  Promise.all(promises).then(comps => {
    console.log(newCompetenciesObject)
    let count = 1
    for (let id of justCompetencyIds) {
      let helper = comps.filter(el => el._id == id);
      let comp = helper[0];
      for (let skillNumber of competenciesAndSkills[id]) {
        skill = comp.skills.filter(el => el.number == skillNumber);
        newCompetenciesObject[id].push(...skill);
        count++
        // console.log(newCompetenciesObject[id])
      }
    }
    console.log(newCompetenciesObject);
  });
}
//roles routes. uses "/roles"
//index
router.get("/", (req, res) => {
  Role.find({}) //I'll need stuff here once I implemenent different institutions and users
    .populate({ path: "competenciesAndSkills.competency" })
    .populate({ path: "competenciesAndSkills.skills" })
    .exec((err, allRoles) => {
      if (err) {
        res.send("OOPS!"); // fix error handling
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
    let skillsObj = createSkillsMap(req.body.skills); // right now there's no protection against returning an onject key with 0 and other numbers. should be one or the other.
    findCompetencyIds(skillsObj).then(result => {
      findSkillIds(result);
    });

    // the next step will be to create an object that I can push by itself onto the new Role.
    // console.log(skillsObj)
    //     Role.create({ name: roleName, description: roleDescription })
    //       .then(role => {
    //         let skillKeys = Object.keys(skillsObj);
    //         let newSkillsArray = [];
    //         skillKeys.forEach(key => {
    //           //I need to rewrite ths and and the below forEach as traditioal For loops.
    //           const keyAsNum = Number(key);
    //           Competency.findOne({ number: keyAsNum })
    //             .populate("skills")
    //             .then(competency => {
    //               skillsObj[key].forEach(el => {
    //                 if (el == 0) {
    //                   newSkillsArray.push(...competency.skills);
    //                 } else {
    //                   index = competency.skills.findIndex(
    //                     element => element.number == el
    //                   );
    //                   newSkillsArray.push(competency.skills[index]);
    //                 }
    //               });
    //               role.competenciesAndSkills.push({
    //                 competency: competency._id,
    //                 skills: [...newSkillsArray]
    //               });
    //               role.save();
    //             });
    //         });
    //       }).catch(err => {
    //         res.send(err)
    //       })
    //       .then(setTimeout(() => res.redirect("/roles"), 0));
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
//I'll probably need to write a new function that returns skill/competency objects to add to arrays/competencies.
//That's something I do a lot already, and something I will need again at all of these update routes.
router.put("/:id", (req, res) => {
  try {
    const skillsObj = createSkillsMap(req.body.skills);
    findCompetencyIds(skillsObj).then(result => {
      findSkillIds(skillsObj, result).then(ids => {
        Role.findById(req.params.id)
          .then(role => {
            result.forEach(comp => {
              //at some point in here, I should check if the comps/skills are already a part of the role
              let competencyIndex = role.competenciesAndSkills.findIndex(
                element => String(element.competency) == String(comp)
              );
              if (competencyIndex != -1) {
                // if the competency is already a part of the role
                ids[comp].forEach((skill, index) => {
                  let skillId = role.competenciesAndSkills[
                    competencyIndex
                  ].skills.findIndex(
                    element => String(element._id) == String(skill._id)
                  );
                  console.log(skillId);
                  if (skillId == -1) {
                    role.competenciesAndSkills[competencyIndex].skills.push(
                      skill
                    );
                  }
                });
              } else {
                role.competenciesAndSkills.push({
                  competency: comp,
                  skills: [...ids[comp]]
                });
              }
            });
            role
              .save()
              .then(res.redirect(`${req.params.id}/edit`))
              .catch(err => {
                res.send("OOPS!"); // fix error handling
              });
          })
          .catch(err => {
            res.send("OOPS!"); // fix error handling
          });
      });
    });
  } catch (error) {
    res.send("OOPS!"); // fix error handling
  }
});
//Destroy
router.delete("/:id", (req, res) => {
  Role.findByIdAndDelete(req.params.id)
    .then((err, fail) => {
      if (err) {
        throw new error();
      }
      res.redirect("/roles");
    })
    .catch(err => {
      res.send("asdfsdf"); //fix error handling
    });
});

module.exports = router;

const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Role = require("../models/Role.js"),
  Competency = require("../models/Competency.js");

/* This whole function could use some TLC*/
/* This function creates an object, where each key is a competency and each value is an array of specific skills. if 
a competency is added by itself, then the array will be a 0, and that will eventually tell the application to add all
skills from that competency.*/
function createSkillsMap(skills) {
  skillsMap = {};
  skills = skills.split(",");
  skills.forEach(skill => {
    if (!/[1-9]\.[1-9]/g.test(skill) && !/[1-9]$/g.test(skill)) {
      throw Error(`Regular Expression Test Failed for ${skill}`);
    }
    //I really feel like the next 4 lines could be combined into one.
    if (!skillsMap[skill[0]]) {
      skillsMap[skill[0]] = [];
    }
    // It probably would work to just always push skill[2] and accept the undefined
    // but for now, I like the 0 instead. It's reassuring to work with a known value.
    skill[2]
      ? skillsMap[skill[0]].push(Number(skill[2]))
      : skillsMap[skill[0]].push(0);
  });
  return skillsMap;
}



//roles routes. uses "/roles"
//index
router.get("/", (req, res) => {
  Role.find({})
    .populate({ path: "competenciesAndSkills.competency" })
    .populate({ path: "competenciesAndSkills.skills" })
    .exec((err, allRoles) => {
      if (err) {
        console.log(err);
      } else {
        res.render("roles/index", { roles: allRoles });
      }
    });
});
//New
router.get("/new", (req, res) => {
  res.render("roles/new", { name: false, description: false }); //as to not mess up the ejs when opening the form for the first time. This would probably be better handled with cookies, but I don't know how to use those yet.
});
//Create
router.post("/", (req, res) => {
  const roleName = req.body.name;
  const roleDescription = req.body.description;
  try {
    Role.create({ name: roleName, description: roleDescription })
      .then(role => {
        let skillsObj = createSkillsMap(req.body.skills); // right now there's no protection against returning an onject key with 0 and other numbers. should be one or the other.
        let skillKeys = Object.keys(skillsObj);
        let newSkillsArray = [];
        skillKeys.forEach(key => {
          //I need to rewrite ths and and the below forEach as traditioal For loops.
          const keyAsNum = Number(key);
          Competency.findOne({ number: keyAsNum })
            .populate("skills")
            .then(competency => {
              skillsObj[key].forEach(el => {
                if (el == 0) {
                  newSkillsArray.push(...competency.skills);
                } else {
                  index = competency.skills.findIndex(
                    element => element.number == el
                  );
                  newSkillsArray.push(competency.skills[index]);
                }
              });
              console.log(competency._id);
              console.log(newSkillsArray);
              role.competenciesAndSkills.push({
                competency: competency._id,
                skills: [...newSkillsArray]
              });
              role.save();
            });
        });
      })
      .then(setTimeout(() => res.redirect("/roles"), 0));
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
        console.log(err);
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
//I'll probably need to write a new function that returns skill/ competency objects to add to arrays/competencies. 
//That's something I do a lot already, and something I will need again at all of these update routes.
router.put("/:id", (req, res) => {
  
  res.send("This is the Roles UPDATE route")});
//Destroy
router.delete("/:id", (req, res) =>
  res.send("This is the Roles DESTROY route")
);

module.exports = router;

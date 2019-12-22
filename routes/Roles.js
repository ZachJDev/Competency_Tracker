const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Role = require("../models/Role.js"),
  Competency = require("../models/Competency.js");

/* This whole function could use some TLC*/
function createSkillsMap(skills) {
  skillsMap = {};
  skills = skills.split(",");
  skills.forEach(skill => {
    if (!/[1-9].[1-9]/g.test(skill)) {
      throw Error("ahhh");
    }
    //I really feel like the next 4 lines could be combined into one.
    if (!skillsMap[skill[0]]) {
      skillsMap[skill[0]] = [];
    }
    // It probably would be fine to just always psuh skill[2] and accept the undefined
    // but for now, I like the 0 instead. Its reassuring to work with a known value.
    skill[2]
      ? skillsMap[skill[0]].push(Number(skill[2]))
      : skillsMap[skill[0]].push(0);
  });
  return skillsMap;
}
//roles routes
//index
router.get("/", (req, res) => {
  Role.find({}, (err, allRoles) => {
    if (err) {
      console.log(err);
    } else {
      res.render("roles/index", { roles: allRoles });
    }
  });
});
//New
router.get("/new", (req, res) => {
  res.render("roles/new", { name: false, description: false });
});
//Create
router.post("/", (req, res) => {
  let name = req.body.name;
  let description = req.body.description;
  try {
    let skills = createSkillsMap(req.body.skills);
    console.log(skills);
    compet = Competency.findOne({number: 1}) //returns an array
    compet.then( (compett) => {
      addskills = compett.skills.filter(skill => skill.number == 2)
      Role.create({
        name: name,
        description: description, 
      }).then((role) => {
        role.skills.push(addskills[0]);
        role.save()
        console.log(role)
      })
    }); 
    res.redirect("/roles");

  } catch (error) {
    console.log(error);
    res.render("roles/new", { name: name, description: description });
  }
});

//Show
router.get("/:id", (req, res) => {
  Role.findById(req.params.id).populate("skills").exec((err, role) => {
    if (err) {
      console.log(err);
    } else {
      res.render("roles/show", { role: role });
    }
  });
});
//Edit
router.get("/:id/edit", (req, res) => res.send("This is the Roles EDIT route"));
//Update
router.put("/:id", (req, res) => res.send("This is the Roles UPDATE route"));
//Destroy
router.delete("/:id", (req, res) =>
  res.send("This is the Roles DESTROY route")
);

module.exports = router;

const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Role = require("../models/Role.js"),
  Competency = require("../models/Competency.js");

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
  res.render("roles/new");
});
//Create
router.post("/", (req, res) => {
  let name = req.body.name;
  let description = req.body.description;
  //code to take skills as string,
  let bodySkills = req.body.skills.split(",");
  //look up which skills they are,
  // console.log(competency.name);
  //create an array to add them to the new role.

  let newRole = { name: name, description: description, skills: pushSkills[0] };
  console.log(newRole);
  Role.create(newRole, (err, newlyCreatedRole) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(newlyCreatedRole);
      res.redirect("/roles");
    }
  });
});
//Show
router.get("/:id", (req, res) => {
  Role.findById(req.params.id, (err, role) => {
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

const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Role = require("../models/Role.js"),
  Competency = require("../models/Competency.js");

//competencies routes
//index
router.get("/", (req, res) => {
  Competency.find({}, (err, Competencies) => {
    if (err) {
      console.log(err);
    } else {
      res.render("competencies/index.ejs", { Competencies: Competencies });
    }
  });
});
//New
router.get("/new", (req, res) => {
  Competency.countDocuments({}, (err, num) => {
    if (err) {
      console.log(err);
    } else {
      //console.log(num);
      res.render("competencies/new", { count: num });
    }
  });
});

//Create
router.post("/", (req, res) => {
  let newCompetency = { name: req.body.competencyName, description: req.body.description, number: req.body.number };
  Competency.create(newCompetency, (err, newlyCreatedCompetency) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Competency Created!");
      res.redirect("/competencies");
    }
  });
});

//Show
router.get("/:id", (req, res) =>
  res.send("This is the competencies SHOW route")
);
//Edit
router.get("/:id/edit", (req, res) =>
  res.send("This is the competencies EDIT route")
);
//Update
router.put("/:id", (req, res) =>
  res.send("This is the competencies UPDATE route")
);
//Destroy
router.delete("/:id", (req, res) =>
  res.send("This is the competencies DESTROY route")
);

module.exports = router;

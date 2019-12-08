const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Role = require("../models/Role.js"),
  DeletedCompetencyCounter = require("../models/DeletedCompetencyCounter"),
  Competency = require("../models/Competency.js");

//competencies routes
//index
router.get("/", (req, res) => {
  Competency.find({}, null, {sort: {number: 1}}, (err, Competencies) => { //trying sort with competencies and positional insertion with skills. (partly because I'm having trouble sorting arrays ofsubdocuments with the sort method/option)
    if (err) {
      console.log(err);
    } else {
      res.render("competencies/index.ejs", { Competencies: Competencies })
    }
  });
});
//New
router.get("/new", (req, res) => {
  let counter = DeletedCompetencyCounter.findOne({});
  counter.then(element => {
    console.log(element.count);
    if (element.count.length) {
      console.log("shift time!");
      var number = element.count.shift();
      element.save();
      res.render("competencies/new", { count: number });
    } else {
      Competency.countDocuments({}, (err, count) => {
        //this kept returning undefined when structured like a promise, so I rewrote it to be callback-y
        if (err) {
          console.log(err);
        } else {
          console.log("Counting Comps Time!" + count);
          var number = count+1;
          res.render("competencies/new", { count: number }); //the asyc essence of countDocs made it pretty impossible to keep this outside of this callback
        }
      });
    }
  });
}); //if anyone comes and sees this code and the comment previously here, I was wrong. mongoose queries are NOT promises.

//Create
router.post("/", (req, res) => {
  let newCompetency = {
    name: req.body.competencyName,
    description: req.body.description,
    number: req.body.number
  };
  Competency.create(newCompetency).then(res.redirect("/Competencies"));
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

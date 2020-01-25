const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Role = require("../models/Role.js"),
  DeletedCompetencyCounter = require("../models/DeletedCompetencyCounter"),
  Skill = require("../models/Skill");
Competency = require("../models/Competency.js");

//competencies routes
//index
router.get("/", (req, res) => {
  Competency.find({}, null, { sort: { number: 1 } })
    .populate({ path: "skills", options: { sort: { number: 1 } } })
    .exec((err, Competencies) => {
      if (err) {
        res.send("OOPS!"); // fix error handling
      } else {
        res.render("competencies/index.ejs", { Competencies: Competencies });
      }
    });
});
//New
router.get("/new", (req, res) => {
DeletedCompetencyCounter.findOneAndUpdate({}, {$setOnInsert: {count: []}}, {upsert: true, sort: {count: -1}, useFindAndModify: false}, (err, element) => {
  console.log(element + " First  Pass")
}) //something that I don't understand is going on here.... for whatever reason, element below in the then() block will be null if I don't have this callback in here. when I have the callback above, it will return null in callback, but the document I want with the then() function. This only happens on the first call, so I think there must be something about the find() and update() operations returning different promises? I'm not sure....
    .then((element) => {
      console.log(element)
      if (!!element.count.length) {
        // console.log(element)
        let number = element.count.shift();
        res.render("competencies/new", { count: number });
      } else {
        Competency.countDocuments({}, (err, count) => {
          //this kept returning undefined when structured like a promise, so I rewrote it to be callback-y
          if (err) {
            console.log(err);
          } else {
            var number = count + 1;
            res.render("competencies/new", { count: number }); //the asyc essence of countDocs made it pretty impossible to keep this outside of this callback
          }
        }).catch(err => {
          res.send("OOPS!"); // fix error handling
        });
      }
    })
}); //if anyone comes and sees this code and the comment previously here, I was wrong. mongoose queries are NOT promises.

//Create
router.post("/", (req, res) => {
  let newCompetency = {
    name: req.body.competencyName,
    description: req.body.description,
    number: req.body.number
  };
  Competency.create(newCompetency)
    .then(res.redirect("/Competencies"))
    .catch(err => {
      res.send("OOPS!"); // fix error handling
    });
});

//Show
router.get("/:id", (req, res) =>
  Competency.findById(req.params.id)
    .populate({ path: " skills" })
    .then(competency =>
      res.render("competencies/show", { competency: competency })
    )
    .catch(err => {
      res.send("OOPS!"); // fix error handling
    })
);
//Edit
router.get("/:id/edit", (req, res) =>
  Competency.findById(req.params.id)
    .populate({ path: " skills" })
    .then(competency =>
      res.render("competencies/edit", { competency: competency })
    )
    .catch(err => {
      res.send("OOPS!"); // fix error handling
    })
);
//Update
router.put("/:id", (req, res) => {
  console.log(req.body.competencyName);
  Competency.findByIdAndUpdate(req.params.id, {
    $set: { name: req.body.competencyName, description: req.body.description }
  }).then(
    res.redirect("/competencies").catch(err => {
      res.send("OOPS!"); // fix error handling
    })
  );
});
//Destroy
//I still need to add the deleted competency to the counter
router.delete("/:id", (req, res) => {
  Competency.findById(req.params.id)
    .then(competency => {
      let promises = [];
      for (i = 0; i < competency.skills.length; i++) {
        promises.push(Skill.findByIdAndDelete(competency.skills[i]));
      }
      promises.push(
        DeletedCompetencyCounter.findOneAndUpdate({},  {$push: {count: {$each: [competency.number], $sort: 1}}}, {upsert: true}) // redundant with the create route, but if there's some circumstance where the counter doesn't get created when the first competency does, this should hopefully catch it
      );
      Promise.all(promises).then(
        Competency.findByIdAndDelete(req.params.id)
          .then(res.redirect("/competencies"))
          .catch(err => {
            res.send("OOPS!"); // fix error handling
          })
      );
    })
    .catch(err => {
      res.send("OOPS!"); // fix error handling
    });
});

module.exports = router;

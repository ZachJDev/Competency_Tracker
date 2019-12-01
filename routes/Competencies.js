const express    = require("express"),
      router     = express.Router(),
      Role       = require("../models/Role.js"),
      Competency = require("../models/Competency.js");

//competencies routes
//index
router.get("/", (req, res) => {
    Competency.findOne({}, (err, Competency) => res.render("competencies/index.ejs", {Competency:Competency}))
});
//New
router.get("/new", (req, res) => res.render("competencies/new"));

//Create
router.post("/", (req, res) => {
    let name = req.body.competencyName
    let description = req.body.description

    let newCompetency = {name: name, description: description}
    Competency.create(newCompetency, (err, newlyCreatedCompetency) => {
        if(err) { console.log(err) } 
            else {
                console.log("Competency Created!");
                res.redirect("/")
            }
    })
});

//Show
router.get("/:id", (req, res) => res.send("This is the competencies SHOW route"));
//Edit
router.get("/:id/edit", (req, res) => res.send("This is the competencies EDIT route"));
//Update
router.put("/:id",(req, res) => res.send("This is the competencies UPDATE route"));
//Destroy
router.delete("/:id", (req, res) => res.send("This is the competencies DESTROY route"));


module.exports = router
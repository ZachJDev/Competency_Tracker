const Role = require("../../models/Role"),
  Competency = require("../../models/Competency"),
  Skill = require("../../models/Skill");
var middleware = {};

middleware.checkForRole = function(req, res, next) {
  Role.findById(req.params.id, (err, foundRole) => {
    if (err || !foundRole) {
      res.redirect("back");
    } else next();
  });
};

middleware.checkForCompetency = function(req, res, next) {
  Competency.findById(req.params.id, (err, foundCompetency) => {
    if (err || !foundCompetency) {
        console.log("NO!")
      res.redirect("/competencies");
    } else next();
  });
};

middleware.checkForSkill = function(req, res, next) {
    Skill.findById(req.params.skill_id, (err, foundSkill) => {
        if(err || !foundSkill) {
            res.redirect("/competencies");
        } else next();
    })
}

module.exports = middleware;
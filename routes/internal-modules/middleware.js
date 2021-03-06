const Role = require('../../models/Role');
const Competency = require('../../models/Competency');
const Skill = require('../../models/Skill');
const User = require('../../models/Users');


const middleware = {};

middleware.findUserSession = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  return User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      return next();
    })
    .catch((err) => console.log(err));
};

middleware.isUserAuthenticated = (req, res, next) => {
  if (req.session.isLoggedIn) next();
  else {
    req.flash('error', 'Please Log in');
    res.redirect('/login');
  }
};

middleware.checkForRole = (req, res, next) => {
  Role.findById(req.params.id, (err, foundRole) => {
    if (err || !foundRole) {
      res.redirect('back');
    } else {
      req.role = foundRole;
      next();
    }
  });
};

middleware.checkForCompetency = (req, res, next) => {
  Competency.findById(req.params.id, (err, foundCompetency) => {
    if (err || !foundCompetency) {
      console.log('no Competency Found');
      res.redirect('/competencies');
    } else {
      req.competency = foundCompetency;
      next();
    }
  });
};

middleware.checkForSkill = (req, res, next) => {
  Skill.findById(req.params.skill_id, (err, foundSkill) => {
    if (err || !foundSkill) {
      res.redirect('/competencies');
    } else {
      req.skill = foundSkill;
      next();
    }
  });
};

middleware.addLocals = (req, res, next) => {
  Object.assign(res.locals, {
    isLoggedIn: req.session.isLoggedIn,
    name: req.user ? req.user.name : null,
    csrfToken: req.csrfToken(),
    institution: req.user ? req.user.institutionName : null,
    skillSelector: false,
  });

  next();
};

module.exports = middleware;

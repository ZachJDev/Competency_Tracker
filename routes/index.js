const express = require('express');

const router = express.Router({ mergeParams: true });

const Competency = require('../models/Competency');
const DeletedCompetencyCounter = require('../models/DeletedCompetencyCounter');
const Role = require('../models/Role');


router.get('/', (req, res) => {
  if (req.session.isLoggedIn) {
    const promises = [];
    promises.push(Competency.find({ institution: req.user.institutionName }, null, { sort: { dateUpdated: 1 }, limit: 5 }));
    promises.push(Role.find({ institution: req.user.institutionName }, null, { sort: { dateUpdated: 1 }, limit: 5 }));
    Promise.all(promises).then((values) => {
      const roles = values[1];
      const competencies = values[0];
      res.render('./index/home', {
        errorMessage: req.flash('error'),
        competencies,
        roles,
      });
    });
  } else {
    res.render('./index/home', {
      errorMessage: req.flash('error'),
    });
  }
});
module.exports = router;

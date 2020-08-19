const CompetenciesAndSkillsList = require('../routes/internal-modules/Competencies-and-skillsObj');
const Role = require('../models/Role.js');
const Competency = require('../models/Competency.js');


exports.index = (req, res) => {
  Role.find({ institution: req.user.institutionName }) // I'll need stuff here once I implemenent different institutions and users
    .populate({ path: 'competenciesAndSkills.competency' })
    .populate({ path: 'competenciesAndSkills.skills' })
    .exec()
    .then((allRoles) => {
      res.render('roles/index', { roles: allRoles });
    })
    // eslint-disable-next-line no-console
    .catch((err) => console.log(err));
};

exports.new = (req, res) => {
  try {
    Competency.find({ institution: req.user.institutionName }, null, { sort: { number: 1 } })
      .populate({ path: ' skills', options: { sort: { number: 1 } } })
      .then((comps) => {
        res.render('roles/new', { name: false, description: false, comps });
      });
  } catch (err) {
    res.send('OOPS!'); // fix error handling
  }
};

exports.create = (req, res) => {
  const roleName = req.body.name;
  const roleDescription = req.body.description;
  try {
    const compInfo = new CompetenciesAndSkillsList(req.body.skills, req.user.institutionName);
    compInfo.init()
      .then(() => Role.create({
        name: roleName,
        description: roleDescription,
        rawSkills: Array.from(compInfo.skillsSet),
        competenciesAndSkills: compInfo.skillIdsArray,
        institution: req.user.institutionName,
        dateUpdated: Date.now(),
      }))
      .then(res.redirect('/roles'))
      .catch((err) => console.log(err));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error When Creating Role', error);
    res.render('roles/new', { roleName, roleDescription });
  }
};

exports.show = (req, res) => {
  Role.findById(req.params.id)
    .populate({ path: 'competenciesAndSkills.competency' })
    .populate({ path: 'competenciesAndSkills.skills' })
    .exec()
    .then((role) => {
      res.render('roles/show', { role });
    })
    // eslint-disable-next-line no-console
    .catch((err) => console.log(err));
};

exports.edit = (req, res) => {
  Role.findById(req.params.id)
    .populate({ path: 'competenciesAndSkills.competency' })
    .populate({ path: 'competenciesAndSkills.skills' })
    .exec()
    .then((role) => {
      res.render('roles/edit', { role });
    })
    // eslint-disable-next-line no-console
    .catch((err) => console.log(err));
};

exports.update = (req, res) => {
  const updatedDescription = req.body.description;
  const updatedName = req.body.name;

  Role.findById(req.params.id)
    .then((role) => {
    // I don't think I need to be changing these from Array to Set back to Array....
      const oldSkills = new Set(role.rawSkills);
      const newSkills = req.body.skills;
      const updateCompeteniesAndSkillsInfo = new CompetenciesAndSkillsList(
        newSkills,
        Array.from(oldSkills),
      );
      return updateCompeteniesAndSkillsInfo.init()
        .then(() => {
          role.competenciesAndSkills = updateCompeteniesAndSkillsInfo.skillIdsArray;
          role.rawSkills = Array.from(updateCompeteniesAndSkillsInfo.skillsSet);
          role.name = updatedName;
          role.description = updatedDescription;
          role.dateUpdated = Date.now();
          return role.save();
        });
    })
    .then(res.redirect(`${req.params.id}`))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err); // fix error handling
    });
};

exports.removeFromSkills = (req, res) => {
  Role.findById(req.params.id)
    .populate({ path: 'competenciesAndSkills.competency' })
    .populate({ path: 'competenciesAndSkills.skills' })
    .exec()
    .then((doc) => {
      let updatedList = doc.competenciesAndSkills;
      if (req.query.type === 'competency') {
        updatedList = doc.competenciesAndSkills.filter(
          (i) => i.competency.number != req.query.number,
        );
      } else if (req.query.type === 'skill') {
        const index = doc.competenciesAndSkills.findIndex(
          (i) => i.competency.number.toString() === req.query.competency,
        );
        const updatedSkills = doc.competenciesAndSkills[index].skills.filter(
          (i) => i.number != req.query.number,
        );
        if (!updatedSkills.length) {
          // Remove the entire competency
          updatedList.splice(index, 1);
        } else {
          updatedList[index].skills = updatedSkills;
        }
      } else {
        throw new Error(`Cannont delete '${req.query.type}'.`);
      }

      doc.competenciesAndSkills = updatedList;
      return doc.generateRawSkillsAndSave();
    })
    .then(res.redirect(`/roles/${req.params.id}`))
    // eslint-disable-next-line no-console
    .catch((err) => console.log(err));
};

exports.destroy = (req, res) => {
  Role.findByIdAndDelete(req.params.id)
    .then((success, fail) => {
      if (success) {
        res.redirect('/roles');
      } else {
        throw new Error(`Error When deleting Role: ${req.params.id}`);
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err); // fix error handling
    });
};

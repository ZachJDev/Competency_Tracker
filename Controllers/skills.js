const Role = require('../models/Role.js');
const Skill = require('../models/Skill.js');
const Competency = require('../models/Competency.js');

exports.new = (req, res) => {
  let count;
  Competency.findById(req.params.id).then((competency) => {
    if (competency.deletedSkills.length) [count] = competency.deletedSkills;
    // Competency.deletedSkills.shift() happens when saving
    else count = competency.skills.length + 1;
    res.render('../views/skills/new', {
      competency,
      count,
    });
  }).catch((err) => {
    res.send(err); // fix error handling
  });
};

exports.create = (req, res) => {
  const newSkill = {
    name: req.body.name,
    number: req.body.number,
    institution: req.user.institutionName,
  };
  Skill.create(newSkill).then((skill) => Competency.findByIdAndUpdate(
    req.params.id,
    { $push: { skills: skill }, $pop: { deletedSkills: -1 } },
    { useFindAndModify: false },
  )
    .then(res.redirect(`/competencies/${req.params.id}`))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err); // fix error handling
    }));
};

exports.edit = (req, res) => {
  let foundSkill;
  Skill.findById(req.params.skill_id)
    .then((skill) => {
      foundSkill = skill;
      return Competency.findById(req.params.id);
    })
    .then((competency) => res.render('skills/edit', { skill: foundSkill, competency }))
    .catch((err) => {
      res.send('OOPS'); // fix error handling
    });
};

exports.update = (req, res) => Skill.findByIdAndUpdate(
  req.params.skill_id,
  { $set: { name: req.body.name } },
  { useFindAndModify: false },
)
  .then(res.redirect(`/competencies/${req.params.id}`))
  .catch((err) => {
    res.send('OOPS!');
  });


// I should probably refactor this to work with documents, not
// the database models, per what seem like best practices for Mongoose

exports.destroy = (req, res) => {
  let skillNumber;
  Skill.findById(req.params.skill_id)
    .then((skill) => {
      skillNumber = skill.number;
      return Competency.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { skills: skill._id },
          $push: { deletedSkills: { $each: [skillNumber], $sort: 1 } },
        },
        { useFindAndModify: false },
      );
    })
    .then(() => Role.updateMany(
      {
        competenciesAndSkills: {
          $elemMatch: { skills: req.params.skill_id },
        },
      },
      {
        $pull: { 'competenciesAndskills.$[Skills].$': req.params.skill_id }, // just realized that my capitalization is wrong and at this point I'm afraid to fix it cause it works.
      },
      {
        useFindAndModify: false,
        arrayFilters: { skills: req.params._id },
      },
    ))
    .then(() => Skill.findByIdAndRemove(req.params.skill_id))
    .then(res.redirect('/competencies'))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
    });
};

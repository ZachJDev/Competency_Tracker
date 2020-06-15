
const Skill = require('../models/Skill');
const Competency = require('../models/Competency.js');


exports.new = (req, res) => {
  let sendCompetency;
  Competency.findById(req.params.id)
    .then((competency) => {
      sendCompetency = competency;
      return Skill.findById(req.params.skill_id);
    })
    .then((skill) => {
      const count = skill.deletedSubSkills.length
        ? skill.deletedSubSkills[0]
        : skill.subSkills.length + 1;
      res.render('../views/subskills/new', {
        count,
        competency: sendCompetency,
        // eslint-disable-next-line object-shorthand
        skill: skill,
      });
    })
    .catch((err) => {
      res.send(err); // fix error handling
    });
};

exports.create = (req, res) => {
  const newSubSkill = {
    number: req.body.number,
    name: req.body.name,
  };
  Skill.findById(req.params.skill_id)
    .then((skill) => {
      skill.subSkills.push(newSubSkill);
      skill.subSkills.sort((a, b) => a.number - b.number);
      skill.deletedSubSkills.shift();
      return skill.save();
    }).then((skill) => {
      res.redirect(`/competencies/${req.params.id}`);
    })
    .catch((err) => {
      res.send('OOPS!'); // fix error handling
    });
};

exports.edit = (req, res) => {
  const promises = [];
  let subSkill;
  promises[0] = Competency.findById(req.params.id);
  promises[1] = Skill.findById(req.params.skill_id);
  Promise.all(promises)
    .then(([competency, skill]) => {
      subSkill = skill.subSkills.find(
        (element) => (element.id === req.params.subskill_id),
      );
      res.render('../views/subskills/edit.ejs', {
        competency,
        skill,
        subSkill,
      });
    })
    .catch((err) => {
      res.send('OOPS!'); // fix error handling
    });
};

exports.update = (req, res) => {
  Skill.findOneAndUpdate(
    { _id: req.params.skill_id },
    { $set: { 'subSkills.$[element].name': req.body.name } },
    {
      arrayFilters: [{ 'element._id': { $eq: req.params.subskill_id } }],
      useFindAndModify: false,
    },
  )
    .then((skill) => res.redirect(`/competencies/${req.params.id}`))
    .catch((err) => {
      console.log(err);
      res.redirect(`/competencies/${req.params.id}`);
    });
};

exports.destory = (req, res) => {
  Skill.findByIdAndUpdate(req.params.skill_id)
    .then((skill) => {
      const subSkill = skill.subSkills.id(req.params.subskill_id);
      const subSkillIndex = skill.subSkills.findIndex(
        (element) => element == subSkill,
      );
      skill.subSkills.splice(subSkillIndex, 1);
      skill.deletedSubSkills.push(subSkill.number);
      // This should ensure that the user will always have the lowest deleted subskill number
      skill.deletedSubSkills.sort((a, b) => a - b);
      return skill.save();
    }).then(res.redirect(`/competencies/${req.params.id}`))
    .catch((err) => {
      res.send('OOPS!'); // fix error handling
    });
};

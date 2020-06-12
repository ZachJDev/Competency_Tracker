const Role = require('../models/Role.js');
const Skill = require('../models/Skill');
const Competency = require('../models/Competency.js');


// I'm thinking that I can't sort subSkills, because that seems like
// a much cleaner solution than what I've done here.

function findInsertionIndex(number, skillNumbers) {
  // I'll need to rewrite this as a for loop if i don't want it to iterate through the entire array.
  // and of course I should also refactor this and the same function for skills into one spot.
  let newIndex = 0;
  skillNumbers.forEach((el, index, array) => {
    if (number > array[index].number && number < array[index + 1].number) {
      newIndex = index + 1;
    }
  });
  return newIndex;
}

exports.new = (req, res) => {
  Competency.findById(req.params.id)
    .then((competency) => {
      const sendCompetency = competency;
      Skill.findById(req.params.skill_id)
        .then((skill) => {
          try {
            const sendSkill = skill;
            const count = skill.deletedSubSkills.length
              ? skill.deletedSubSkills.shift()
              : skill.subSkills.length + 1;
            skill.save();
            res.render('../views/subskills/new', {
              count,
              competency: sendCompetency,
              skill: sendSkill,
            });
          } catch (error) {
            res.send('OOPS!'); // fix error handling
          }
        })
        .catch((err) => {
          res.send('OOPS!'); // fix error handling
        });
    })
    .catch((err) => {
      res.send('OOPS!'); // fix error handling
    });
};


exports.create = (req, res) => {
  const newSubSkill = {
    number: req.body.number,
    name: req.body.name,
  };
  Skill.findById(req.params.skill_id)
    .then((skill) => {
      try {
        const { subSkills } = skill;
        if (subSkills.length) {
          if (newSubSkill.number < subSkills[0].number) {
            // insert at front
            skill.subSkills.splice(0, 0, newSubSkill);
            skill.save().then(res.redirect(`/competencies/${req.params.id}`));
          } else if (
            newSubSkill.number > subSkills[subSkills.length - 1].number
          ) {
            // insert at back (combine with the outer else?)
            skill.subSkills.push(newSubSkill);
            skill.save().then(res.redirect(`/competencies/${req.params.id}`));
          } else {
            // insert in the middle
            const newIndex = findInsertionIndex(newSubSkill.number, subSkills);
            skill.subSkills.splice(newIndex, 0, newSubSkill);
            console.log(skill.subSkills);
            skill.save().then(res.redirect(`/competencies/${req.params.id}`));
          }
        } else {
          // when there are no
          skill.subSkills.push(newSubSkill);
          skill.save().then(res.redirect(`/competencies/${req.params.id}`));
        }
      } catch (error) {
        res.send('OOPS!'); // fix error handling
      }
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
      // I feel like all of these nested .then()s might miss the point of doing them. OR I'm using them correctly, and it's just what one has to do to do nested asychronous calls.
      const subSkill = skill.subSkills.id(req.params.subskill_id);
      const subSkillIndex = skill.subSkills.findIndex(
        (element) => element == subSkill,
      );
      skill.subSkills.splice(subSkillIndex, 1);
      skill.deletedSubSkills.push(subSkill.number);
      // I need to write a sort function that works with numbers and not strings.
      skill
        .save()
        .then(res.redirect(`/competencies/${req.params.id}`))
        .catch((err) => {
          res.send('OOPS!'); // fix error handling
        });
    })
    .catch((err) => {
      res.send('OOPS!'); // fix error handling
    });
};

const Competency = require('../models/Competency');
const DeletedCompetencyCounter = require('../models/DeletedCompetencyCounter');
const Role = require('../models/Role');
const Skill = require('../models/Skill');


exports.competenciesIndex = (req, res) => {
  Competency.find({ institution: req.user.institutionName }, null, { sort: { number: 1 } })
    .populate({ path: 'skills', options: { sort: { number: 1 } } })
    .exec((err, Competencies) => {
      if (!err) res.render('competencies/index.ejs', { Competencies });
      else {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    });
};

exports.getNew = (req, res) => {
  let number;
  DeletedCompetencyCounter.findOneAndUpdate(
    { institution: req.user.institutionName },
    { $setOnInsert: { count: [] } },
    { upsert: true, sort: { count: -1 }, useFindAndModify: false },
  )
    .then((element) => {
      if (element.count.length) [number] = element.count;
      return number;
    })
    .then((num) => {
      if (!num) {
        // Count the Competencies to find the next number
        return Competency.countDocuments({ institution: req.user.institutionName },
          (err, count) => {
            number = count + 1;
            return number;
          });
      }
      return num;
    })
    .then(() => {
      res.render('competencies/new', { count: number }); // the asyc essence of countDocs made it pretty impossible to keep this outside of this callback
    })
    .catch((err) => {
      res.send(err); // fix error handling
    });
};

exports.create = (req, res) => {
  const newCompetency = {
    name: req.body.competencyName,
    description: req.body.description,
    number: req.body.number,
    institution: req.user.institutionName,
    dateUpdated: Date.now(),
  };

  DeletedCompetencyCounter.findOneAndUpdate({ institution: req.user.institutionName },
    { $pop: { count: -1 } },
    { useFindAndModify: false })
    .then((doc) => doc.save())
    .then(() => Competency.create(newCompetency))
    .then(res.redirect('/Competencies'))
    .catch((err) => {
      res.send('OOPS!'); // fix error handling
    });
};

exports.show = (req, res) => {
  Competency.findById(req.params.id)
    .populate({ path: ' skills', options: { sort: { number: 1 } } })
    .then((competency) => res.render('competencies/show', { competency }))
    .catch((err) => {
      res.send('OOPS!'); // fix error handling
    });
};

exports.getEdit = (req, res) => Competency.findById(req.params.id)
  .populate({ path: ' skills' })
  .then((competency) => res.render('competencies/edit', { competency }))
  .catch((err) => {
    res.send('OOPS!'); // fix error handling
  });

exports.update = (req, res) => {
  // console.log(req.body.competencyName);
  Competency.findByIdAndUpdate(req.params.id, {
    $set: { name: req.body.competencyName, description: req.body.description, dateUpdated: Date.now() },
  })
    .then(res.redirect('/competencies'))
    .catch((err) => {
      res.send('OOPS!'); // fix error handling
    });
};

exports.destroy = (req, res) => {
  const promises = [];
  Competency.findById(req.params.id)
    .then((competency) => {
      for (let i = 0; i < competency.skills.length; i += 1) {
        promises.push(Skill.findByIdAndDelete(competency.skills[i]));
      }
      promises.push(
        DeletedCompetencyCounter.findOneAndUpdate(
          { institution: req.user.institutionName },
          { $push: { count: { $each: [competency.number], $sort: 1 } } },
          { upsert: true },
        ), // redundant with the create route, but if there's some circumstance where
        // The counter doesn't get created when the first competency does, this should catch it
      );
      return Role.updateMany(
        {
          competenciesAndSkills: {
            $elemMatch: { competency: req.params.id },
          },
        },
        {
          $pull: {
            competenciesAndSkills: { competency: req.params.id },
          },
        },
        { useFindAndModify: false },
      );
    })
    .then((result) => Promise.all(promises))
    .then(() => Competency.findByIdAndDelete(req.params.id))
    .then(() => res.redirect('/competencies')) // fix error handling
    .catch((err) => {
      // console.log(err);
      res.send('OOPS!'); // fix error handling
    });
};

exports.getJson = (req, res) => (
  Competency.find({ institution: req.user.institutionName, number: req.query.num })
    .populate({ path: ' skills', options: { sort: { number: 1 } } })
    .then((comps) => {
      res.json(comps);
    })
);

const Competency = require('../models/Competency');
const DeletedCompetencyCounter = require('../models/DeletedCompetencyCounter');
const Role = require('../models/Role');
const Skill = require('../models/Skill');


exports.competenciesIndex = (req, res) => {
  Competency.find({}, null, { sort: { number: 1 } })
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
    {},
    { $setOnInsert: { count: [] } },
    { upsert: true, sort: { count: -1 }, useFindAndModify: false },
  )
    .then((element) => {
      if (element.count.length) [number] = element.count;
      return number;
    })
    .then((num) => {
      if (!num) {
        return Competency.countDocuments({}, (err, count) => {
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
      res.send('OOPS!'); // fix error handling
    });
};

exports.create = (req, res) => {
  const newCompetency = {
    name: req.body.competencyName,
    description: req.body.description,
    number: req.body.number,
  };

  DeletedCompetencyCounter.findOneAndUpdate({}, { $pop: { count: -1 } },
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
    $set: { name: req.body.competencyName, description: req.body.description },
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
          {},
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
    .then((result) =>
      // console.log(result);
      Promise.all(promises))
    .then(() => Competency.findByIdAndDelete(req.params.id))
    .then(() => res.redirect('/competencies')) // fix error handling
    .catch((err) => {
      // console.log(err);
      res.send('OOPS!'); // fix error handling
    });
};

const mongoose = require('mongoose');
const Competency = require('./models/Competency');
const Role = require('./models/Role');
const Skill = require('./models/Skill');

const Skills = require('./skillsReset');
const Competencies = require('./competenciesReset');

const database = process.env.COMP_DATABASEURL;


mongoose.connect(database,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    // Delete all skills and roles from MI
    console.log('Starting Database Reset');
    const toDelete = [];
    toDelete.push(Competency.deleteMany({ institution: 'Madison Institute' }));
    toDelete.push(Role.deleteMany({ institution: 'Madison Institute' }));
    toDelete.push(Skill.deleteMany({ institution: 'Madison Institute' }));
    return Promise.all(toDelete);
  })
  .then((deleted) => { // Add the Competencies
    const toCreate = [];
    Competencies.forEach((comp) => {
      toCreate.push(Competency.create(comp));
    });
    return Promise.all(toCreate);
  })
  .then((createdCompetencies) => { // Add the Skills
    const createSkills = [];
    for (let i = 0; i < createdCompetencies.length; i++) {
      const comp = createdCompetencies[i]._id;
      createSkills.push(Skill.create(Skills[i]).then(((skills) => Competency.findById(comp).then((c) => {
        c.skills.push(...skills);
        return c.save();
      }))));
    }
    return Promise.all(createSkills);
  })
  .then((createdSkills) => mongoose.connection.close())
  .then(() => {
    console.log('Database Reset Finished');
  });

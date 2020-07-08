/* eslint-disable no-restricted-syntax */
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: String,
  description: String,
  institution: String,
  rawSkills: [String],
  competenciesAndSkills: [
    {
      competency: { type: mongoose.Schema.Types.ObjectId, ref: 'Competency' },
      skills: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Skill',
        },
      ],
    },
  ],
});

roleSchema.methods.generateRawSkillsAndSave = function () {
  const newSkills = [];
  const cs = this.competenciesAndSkills;

  for (const comp of cs) {
    for (const skill of comp.skills) {
      newSkills.push(`${comp.competency.number}.${skill.number}`);
    }
  }
  // this.rawSkills = this.competenciesAndSkills.map((cs) => {
  //   for (skill of cs.skills) return `${cs.competency.number}.${skill.number}`;
  // cs.skills.map((skill) => `${cs.competency.number}.${skill.number}`)
  this.rawSkills = newSkills;
  return this.save();
};

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: String,
  number: Number,
  institution: String,
  deletedSubSkills: [Number],
  subSkills: [
    {
      name: String,
      number: Number,
    },
  ],
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;

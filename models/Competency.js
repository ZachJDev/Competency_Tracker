const mongoose = require("mongoose");

const competencySchema = new mongoose.Schema({
  name: String,
  description: String,
  number: Number,
  topic: [{ name: String, description: String }],
  skillsArray: [Number],
  skills: [
    {
      name: String,
      number: Number,
      subSkillArray: [Number],
      subSkills: [
        {
          name: String,
          number: Number
        }
      ]
    }
  ]
});

const Competency = mongoose.model("Competency", competencySchema);

module.exports = Competency;

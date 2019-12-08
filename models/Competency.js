const mongoose = require("mongoose");

const competencySchema = new mongoose.Schema({
  name: String,
  description: String,
  number: Number,
  topic: [{ name: String, description: String }],
  deletedSkills: [Number],
  skills: [
    {
      name: String,
      number: Number,
      deletedSubSkills: [Number],
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

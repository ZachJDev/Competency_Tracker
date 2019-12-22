const mongoose = require("mongoose");


const competencySchema = new mongoose.Schema({
  name: String,
  description: String,
  number: Number,
  topic: [{ name: String, description: String }],
  deletedSkills: [Number],
  skills: [{type: mongoose.Schema.Types.ObjectId, ref: "Skill"}]
});

const Competency = mongoose.model("Competency", competencySchema);

module.exports = Competency;

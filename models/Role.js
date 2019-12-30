const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: String,
  description: String,
  competenciesAndSkills: [
    {
      competency: { type: mongoose.Schema.Types.ObjectId, ref: "Competency"},
      skills: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Skill"
        }
      ]
    }
  ]
});

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;

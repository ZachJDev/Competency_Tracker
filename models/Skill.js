const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
    name: String,
    description: String,
    competency: {type: mongoose.Schema.Types.ObjectId, ref: 'Competency'},
    number: Number,
    subSkills: [{    
        name: String,
        description: String,
        number: Number}]
});

Skill = mongoose.model("Skill", skillSchema);

module.exports = Skill;
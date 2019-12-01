const mongoose = require("mongoose");

const competencySchema = new mongoose.Schema({
    name: String,
    description: String,
    number: Number,
    topic: [{name: String, description: String}],
    skills: [{
        name: String,
        description: String,
        number: Number,
        subSkills: [{    
            name: String,
            description: String,
            number: Number}]
    }]
});

const Competency = mongoose.model("Competency", competencySchema);

module.exports = Competency;
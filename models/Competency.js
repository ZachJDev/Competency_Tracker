const mongoose = require("mongoose");

const competencySchema = new mongoose.Schema({
    name: {type: String, unique: true},
    description: String,
    number: {type: Number, unique: true},
    topic: [{name: String, description: String}],
    skills: [{
        name: {type: String, unique: true},
        description: String,
        number: {type: Number, unique: true},
        subSkills: [{    
            name: String,
            description: String,
            number: {type: Number, unique: true}}]
    }]
});

const Competency = mongoose.model("Competency", competencySchema);

module.exports = Competency;
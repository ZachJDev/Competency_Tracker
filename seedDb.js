const mongoose = require("mongoose"),
      Competency = require("./models/Competency"),
      Skill = require("./models/Skill"),
      Role = require("./models/Role");

const eat = {
    name: "eat",
    description: "eat stuff",
    number: 1,
    topic: {name: "sustenance", description: "keeping you alive."}
}
const withAFork = {
    name: "eat with a fork",
    description: "use a fork when eating",
    number: 1
}

function removeCollections() {
    Competency.deleteMany({}, (err) => {
        if(err){
            console.log(err);
        } else {
            console.log("removed Competencies!");
        }
    });

    Skill.deleteMany({}, (err) => {
        if(err){
            console.log(err);
        } else {
            console.log("removed Skills!");
        }
    });

    Role.deleteMany({}, (err) =>{
        if(err){
            console.log(err);
        } else {
            console.log("removed Roles!");
        }
    });
}

function seedDB () {
    removeCollections();
    Competency.create(eat, (err, competency) => {
        if(err) {
            console.log(err);
        } else{
            console.log("added a Competency!")
            Skill.create({
                name: "eat with a fork",
                description: "use a fork when eating",
                number: 1
            }, (err, skill) =>{
                if(err){
                    console.log(err);
                } else {
                    skill.competency = competency.name;
                    console.log(skill)
                    console.log(competency)
                    // competency.skills.push({name:skill.name});
                    // competency.save();
                }
            })
        }
    })

}

module.exports = seedDB;
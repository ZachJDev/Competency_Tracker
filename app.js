const express  = require("express"),
      mongoose = require("mongoose"),
      app      = express(),
      port     = 3000;


//Mongoose setup:
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true});
//The fact that I've gone with just one schema will certainly effect some design decisions down the line.
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
})

const Competency = mongoose.model("Competency", competencySchema);

// routes, for now
app.get("/", (req, res) => res.send("Hi"));

//Hello, GitHub Again


app.listen(port, () => console.log("server up"))
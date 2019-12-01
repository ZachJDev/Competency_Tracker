const mongoose = require("mongoose"),
  Competency = require("./models/Competency"),
  Role = require("./models/Role");

const eat = {
  name: "eat",
  description: "eat stuff",
  number: 1,
  topic: { name: "sustenance", description: "keeping you alive." },
  skills: [
    {
      name: "blah",
      description: "blah blah",
      number: 1
    }
  ]
};

function removeCollections() {
  Competency.deleteMany({}, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("removed Competencies!");
    }
  });

  Role.deleteMany({}, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("removed Roles!");
    }
  });
}

function seedDB() {
  removeCollections();
  // Competency.create(eat, (err, competency) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("added a Competency!");
  //   }
  // });
}

module.exports = seedDB;

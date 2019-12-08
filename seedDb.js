const mongoose = require("mongoose"),
  Competency = require("./models/Competency"),
  DeletedCompetencyCounter = require("./models/DeletedCompetencyCounter"),
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
      Competency.create(
        {
          name: "blah",
          number: 1,
          description: "askldjf",
          skills: [
            {
              number: 2,
              name: "ahs",
              deletedSubSkills: [1],
              subSkills: [{ number: 2 }, { number: 3 }]
            },
            { number: 4, name: "ahws" },
            { number: 5, name: "ahw3s" }
          ],
          deletedSkills: [1, 3]
        },
        err => {
          if (err) {
            console.log(err);
          } else {
            console.log("removed Competencies!");
          }
        }
      );
    }
  });

  Role.deleteMany({}, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("removed Roles!");
    }
  });
  DeletedCompetencyCounter.deleteMany({}, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("removed the Competency Counter!");
      DeletedCompetencyCounter.create({ count: [2, 4, 15, 3] }, err => {
        if (err) {
          console.log("oops");
        } else {
          console.log("Created a Counter!");
        }
      });
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

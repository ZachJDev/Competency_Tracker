const mongoose = require("mongoose"),
  Competency = require("./models/Competency"),
  Skill = require("./models/Skill");
(DeletedCompetencyCounter = require("./models/DeletedCompetencyCounter")),
  (Role = require("./models/Role"));

function removeCollections() {

  // createSkills = Skill.create([
  //   {
  //     number: 2,
  //     name: "ahs",
  //     deletedSubSkills: [1],
  //     subSkills: [{ number: 2 }, { number: 3 }]
  //   },
  //   { number: 4, name: "ahws" },
  //   { number: 5, name: "ahw3s" }
  // ]);
  // createSkills.then(skills => {
  //   Competency.deleteMany({}, err => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       Competency.create(
  //         {
  //           name: "blah",
  //           number: 1,
  //           description: "askldjf",
  //           skills: [...skills],
  //           deletedSkills: [1, 3]
  //         },
  //         (err, competency) => {
  //           if (err) {
  //             console.log(err);
  //           } else {
  //             competency.save()
  //             console.log("removed Competencies!");
  //           }
  //         }
  //       );
  //     }
  //   });
  // });

  // Role.deleteMany({}, err => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("removed Roles!");
  //   }
  // });
  DeletedCompetencyCounter.deleteMany({}, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("removed the Competency Counter!");
      DeletedCompetencyCounter.create({ count: [] }, err => {
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

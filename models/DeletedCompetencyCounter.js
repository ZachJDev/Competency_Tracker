const mongoose = require("mongoose");

const DeletedCompetencyCounterSchema = new mongoose.Schema({ count: [Number] });

const DeletedCompetencyCounter = mongoose.model(
  "DeletedCompetencyCounter",
  DeletedCompetencyCounterSchema
);

module.exports = DeletedCompetencyCounter;

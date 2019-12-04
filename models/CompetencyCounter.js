const mongoose = require("mongoose");

const CompetencyCounterSchema = new mongoose.Schema({ count: [Number] });

const CompetencyCounter = mongoose.model(
  "CompetencyCounter",
  CompetencyCounterSchema
);

module.exports = CompetencyCounter;

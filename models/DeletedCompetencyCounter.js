const mongoose = require('mongoose');

const DeletedCompetencyCounterSchema = new mongoose.Schema({ count: [Number], institution: String });

const DeletedCompetencyCounter = mongoose.model(
  'DeletedCompetencyCounter',
  DeletedCompetencyCounterSchema,
);

module.exports = DeletedCompetencyCounter;

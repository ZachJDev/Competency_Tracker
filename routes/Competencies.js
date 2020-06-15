const express = require('express');

const router = express.Router({ mergeParams: true });
const competenciesController = require('../Controllers/competencies');
const middleware = require('./internal-modules/middleware.js');

// competencies routes
// index
router.get('/', competenciesController.competenciesIndex);

// New
router.get('/new', competenciesController.getNew);

// Create
router.post('/', competenciesController.create);

// Show
router.get('/:id', middleware.checkForCompetency, competenciesController.show);

// Edit
router.get('/:id/edit', middleware.checkForCompetency, competenciesController.getEdit);

// Update
router.put('/:id', middleware.checkForCompetency, competenciesController.update);
// Destroy

// I still need to add the deleted competency to the counter
router.delete('/:id', middleware.checkForCompetency, competenciesController.destroy);

module.exports = router;

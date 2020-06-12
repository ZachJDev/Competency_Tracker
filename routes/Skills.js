const express = require('express');

const router = express.Router({ mergeParams: true });

const middleware = require('./internal-modules/middleware');
const skillsController = require('../Controllers/skills');
// Skill routes

// New
router.get('/new', middleware.checkForCompetency, skillsController.new);

// Create
router.post('/', middleware.checkForCompetency, skillsController.create);

// Edit
router.get('/:skill_id/edit', middleware.checkForCompetency, middleware.checkForSkill);

// Update
router.put('/:skill_id', middleware.checkForCompetency, middleware.checkForSkill, skillsController.update);

// Destroy
router.delete('/:skill_id', middleware.checkForCompetency, middleware.checkForSkill, skillsController.destroy);

module.exports = router;

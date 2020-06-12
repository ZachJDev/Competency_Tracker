const express = require('express');

const router = express.Router({ mergeParams: true });

const subSkillsController = require('../Controllers/subSkills');

// New
router.get('/new', subSkillsController.new);

// Create
router.post('/', subSkillsController.create);

// Edit
router.get('/:subskill_id/edit', subSkillsController.edit);
// Update
router.put('/:subskill_id', subSkillsController.update);
// Destroy
router.delete('/:subskill_id', subSkillsController.destory);

module.exports = router;

const express = require('express');
const subSkillsController = require('../Controllers/subSkills');

const router = express.Router({ mergeParams: true });


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

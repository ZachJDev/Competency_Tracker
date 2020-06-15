const express = require('express');
const roleController = require('../Controllers/roles');

const router = express.Router({ mergeParams: true });

// roles routes. uses "/roles"
// index
router.get('/', roleController.index);
// New
router.get('/new', roleController.new);
// Create
router.post('/', roleController.create);
// Show
router.get('/:id', roleController.show);
// Edit
router.get('/:id/edit', roleController.edit);
// Update
router.put('/:id', roleController.update);
// Remove individual skills and comps from roles
router.put('/:id/remove/', roleController.removeFromSkills);

// Destroy
router.delete('/:id', roleController.destroy);

module.exports = router;

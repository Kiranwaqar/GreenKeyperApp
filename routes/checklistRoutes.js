const express = require("express");
const router = express.Router();
const { createChecklistTemplate,getAllChecklists, deleteChecklist,updateChecklist,getChecklistsByVehicle} = require('../controllers/checklistController');

router.post('/', createChecklistTemplate);

router.get('/', getAllChecklists);
router.get('/vehicle/:vehicle_id', getChecklistsByVehicle);

router.delete('/:id', deleteChecklist);

router.put('/:id', updateChecklist);

module.exports = router;
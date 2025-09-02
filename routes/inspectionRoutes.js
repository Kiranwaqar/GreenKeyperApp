const express = require("express");
const router = express.Router();
const { createInspection,getInspectionById, getInspectionsByVehicleId,updateInspection, deleteInspection} = require('../controllers/inspectionController');

router.post('/', createInspection);

router.get('/:id', getInspectionById);
router.get('/vehicle/:vehicle_id', getInspectionsByVehicleId);

router.put('/:id', updateInspection);

router.delete('/:id', deleteInspection);

module.exports = router;
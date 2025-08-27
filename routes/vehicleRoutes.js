const express = require("express");
const router = express.Router();
const { createVehicle,getVehicle,deleteVehicle,updateVehicle,getVehiclesByDriver  } = require('../controllers/vehicleController');

router.post("/", createVehicle);

router.get('/:id', getVehicle);
router.get('/driver/:driver_id', getVehiclesByDriver);

router.delete('/:id', deleteVehicle);

router.patch('/:id', updateVehicle);

module.exports = router;
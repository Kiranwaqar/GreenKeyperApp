const express = require("express");
const router = express.Router();
const { createVehicle,getVehicle,deleteVehicle,updateVehicle } = require('../controllers/vehicleController');

router.post("/", createVehicle);

router.get('/:id', getVehicle);

router.delete('/:id', deleteVehicle);

router.patch('/:id', updateVehicle);

module.exports = router;
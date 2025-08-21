const express = require("express");
const router = express.Router();
const {createUser,getAllUsers,getMechanics,getDrivers,loginUser} = require('../controllers/userController');

// POST 
router.post("/", createUser);
router.post("/login", loginUser);

// GET 
router.get("/", getAllUsers);
router.get("/mechanics", getMechanics);
router.get("/drivers", getDrivers);


module.exports = router;

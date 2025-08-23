const express = require("express");
const router = express.Router();
const {createUser,getAllUsers,getMechanics,getDrivers,loginUser,logoutUser,updateUser,deleteUser} = require('../controllers/userController');

// POST 
router.post("/", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// GET 
router.get("/", getAllUsers);
router.get("/mechanics", getMechanics);
router.get("/drivers", getDrivers);

// PATCH
router.patch('/:id', updateUser);

// DELETE
router.delete('/:id', deleteUser);

module.exports = router;

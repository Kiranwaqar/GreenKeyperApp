const express = require("express");
const router = express.Router();

// User routes
const userRoutes = require("./userRoutes");
router.use('/users', userRoutes);

// Vehicle routes
const vehicleRoutes = require("./vehicleRoutes");
router.use('/vehicles', vehicleRoutes);

// Checklist routes
const checklistRoutes=require("./checklistRoutes");
router.use('/checklists', checklistRoutes);

module.exports = router;

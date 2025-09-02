const express = require("express");
const app = express();
const session = require('express-session');
const userRoutes = require("./routes/userRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const checklistRoutes = require("./routes/checklistRoutes");
const inspectionRoutes = require("./routes/inspectionRoutes");  

app.use(express.json()); 

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use('/web', require('./routes/webRoutes'));
app.use('/mobile', require('./routes/mobileRoutes'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

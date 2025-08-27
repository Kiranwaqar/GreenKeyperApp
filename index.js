const express = require("express");
const app = express();
const session = require('express-session');
const userRoutes = require("./routes/userRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const checklistRoutes = require("./routes/checklistRoutes");

app.use(express.json()); 

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use("/users", userRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/checklists", checklistRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

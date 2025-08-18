const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Test GET request
app.get("/test", (req, res) => {
  res.json({
    message: "GET request working!",
    query: req.query, 
  });
});

// Test POST request
app.post("/test", (req, res) => {
  console.log("Body received:", req.body); 
  res.json({
    message: "POST request received!",
    data: req.body,
  });
});

// Test PUT request
app.put("/user/:id", (req, res) => {
  const userId = req.params.id;   
  const updatedData = req.body;  

  console.log(`Updating user ${userId}:`, updatedData);

  res.json({
    message: `User ${userId} updated successfully!`,
    updatedData: updatedData,
  });
});

// Test PATCH request
app.patch("/user/:id", (req, res) => {
  const userId = req.params.id;   
  const updates = req.body;      

  console.log(`Patching user ${userId}:`, updates);

  res.json({
    message: `User ${userId} patched successfully!`,
    updates: updates,
  });
});

// Test HEAD request
app.head("/user/:id", (req, res) => {
  const userId = req.params.id;

  // Just send headers, no body
  res.set({
    "Content-Type": "application/json",
    "Custom-Header": "UserCheck",
    "User-Exists": "true" 
  });

  res.status(200).end(); 
});

// Test OPTIONS request
app.options("/user/:id", (req, res) => {
  res.set("Allow", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
  res.status(200).end();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

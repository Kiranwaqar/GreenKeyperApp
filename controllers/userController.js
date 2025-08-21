const bcrypt = require("bcrypt");
const sql = require("mssql");
const poolPromise = require("../db"); 

// Create user
exports.createUser = async (req, res) => {
  try {
    const { role_id, email, password, first_name, last_name, phone, status } = req.body;

    if (!role_id || !email || !password || !first_name || !last_name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // insert into database
    const pool = await poolPromise;
        await pool.request()
          .input("id", sql.Char(36), crypto.randomUUID()) 
          .input("role_id", sql.Char(36), role_id)
          .input("email", sql.VarChar(255), email)
          .input("password_hash", sql.VarChar(255), password_hash)
          .input("first_name", sql.VarChar(100), first_name)
          .input("last_name", sql.VarChar(100), last_name)
          .input("phone", sql.VarChar(30), phone || null)
          .input("status", sql.VarChar(20), status || null)
          .query(`
            INSERT INTO greenkeyper.Users (id, role_id, email, password_hash, first_name, last_name, phone, status)
            VALUES (@id, @role_id, @email, @password_hash, @first_name, @last_name, @phone, @status)
          `);

    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM greenkeyper.Users");
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get mechanics
exports.getMechanics = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query("SELECT * FROM greenkeyper.Users WHERE role_id = 'FEAE6B7B-2D4E-478A-9739-E67F09C6135E'");
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching mechanics:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get drivers
exports.getDrivers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query("SELECT * FROM greenkeyper.Users WHERE role_id = '05D6CABD-D9BB-4998-A0AF-FD096FBDC068'");
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching drivers:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const pool = await poolPromise;
    const result = await pool.request()
      .input("email", sql.VarChar(255), email)
      .query("SELECT * FROM greenkeyper.Users WHERE email = @email");
    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
    req.session.user = user;
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.logoutUser = (req, res) => {
  if (req.session && req.session.user) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.status(200).json({ message: "Logout successful" });
    });
  } else {
    res.status(401).json({ message: "User not logged in" });
  }
};

// Update user info
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id, email, password, first_name, last_name, phone, status } = req.body;
    const pool = await poolPromise;

    // Hash password if provided
    let password_hash;
    if (password) {
      const saltRounds = 10;
      password_hash = await bcrypt.hash(password, saltRounds);
    }

    // Build dynamic SQL
    let query = 'UPDATE greenkeyper.Users SET ';
    const updates = [];
    if (role_id) updates.push(`role_id = @role_id`);
    if (email) updates.push(`email = @email`);
    if (password_hash) updates.push(`password_hash = @password_hash`);
    if (first_name) updates.push(`first_name = @first_name`);
    if (last_name) updates.push(`last_name = @last_name`);
    if (phone !== undefined) updates.push(`phone = @phone`);
    if (status !== undefined) updates.push(`status = @status`);

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }

    query += updates.join(', ') + ' WHERE id = @id';

    const request = pool.request().input('id', sql.Char(36), id);
    if (role_id) request.input('role_id', sql.Char(36), role_id);
    if (email) request.input('email', sql.VarChar(255), email);
    if (password_hash) request.input('password_hash', sql.VarChar(255), password_hash);
    if (first_name) request.input('first_name', sql.VarChar(100), first_name);
    if (last_name) request.input('last_name', sql.VarChar(100), last_name);
    if (phone !== undefined) request.input('phone', sql.VarChar(30), phone);
    if (status !== undefined) request.input('status', sql.VarChar(20), status);

    await request.query(query);

    res.status(200).json({ message: 'User info updated successfully!' });
  } catch (err) {
    console.error('Error updating user info:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
 
// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Char(36), id)
      .query('DELETE FROM greenkeyper.Users WHERE id = @id');
    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


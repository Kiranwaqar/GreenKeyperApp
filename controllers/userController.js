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




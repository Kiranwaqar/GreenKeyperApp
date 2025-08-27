const sql = require("mssql");
const poolPromise = require("../db");

// Create checklist template
exports.createChecklistTemplate = async (req, res) => {
  try {
    const { checklist_type, created_by, vehicle_id } = req.body;
    if (!checklist_type || !created_by || !vehicle_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Char(36), crypto.randomUUID())
      .input("checklist_type", sql.VarChar(10), checklist_type)
      .input("created_by", sql.Char(36), created_by)
      .input("vehicle_id", sql.Char(36), vehicle_id)
      .query(`
        INSERT INTO GREENKEYPER.Checklist_Templates (id, checklist_type, created_by, vehicle_id)
        VALUES (@id, @checklist_type, @created_by, @vehicle_id)
      `);
    res.status(201).json({ message: "Checklist template created successfully!" });
  } catch (err) {
    console.error("Error creating checklist template:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all checklist templates
exports.getAllChecklists = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM GREENKEYPER.Checklist_Templates');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching checklists:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete checklist template by id
exports.deleteChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Char(36), id)
      .query('DELETE FROM GREENKEYPER.Checklist_Templates WHERE id = @id');
    res.status(200).json({ message: 'Checklist deleted successfully!' });
  } catch (err) {
    console.error('Error deleting checklist:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get checklists by vehicle_id
exports.getChecklistsByVehicle = async (req, res) => {
  try {
    const { vehicle_id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('vehicle_id', sql.Char(36), vehicle_id)
      .query('SELECT * FROM GREENKEYPER.Checklist_Templates WHERE vehicle_id = @vehicle_id');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching checklists by vehicle:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update checklist template info
exports.updateChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const { checklist_type, created_by, vehicle_id } = req.body;
    const pool = await poolPromise;

    // Build dynamic SQL for updating only provided fields
    let query = 'UPDATE GREENKEYPER.Checklist_Templates SET ';
    const updates = [];
    if (checklist_type) updates.push('checklist_type = @checklist_type');
    if (created_by) updates.push('created_by = @created_by');
    if (vehicle_id) updates.push('vehicle_id = @vehicle_id');
    if (updates.length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }
    query += updates.join(', ');
    query += ' WHERE id = @id';

    const request = pool.request().input('id', sql.Char(36), id);
    if (checklist_type) request.input('checklist_type', sql.VarChar(10), checklist_type);
    if (created_by) request.input('created_by', sql.Char(36), created_by);
    if (vehicle_id) request.input('vehicle_id', sql.Char(36), vehicle_id);

    await request.query(query);
    res.status(200).json({ message: 'Checklist updated successfully!' });
  } catch (err) {
    console.error('Error updating checklist:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

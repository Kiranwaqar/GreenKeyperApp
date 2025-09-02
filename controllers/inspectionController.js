const sql = require("mssql");
const poolPromise = require("../db");

// Create inspection
exports.createInspection = async (req, res) => {
  try {
    const { vehicle_id, driver_id, inspection_type, started_at, completed_at, status, signed_by, checklist_id } = req.body;
    if (!vehicle_id || !driver_id || !inspection_type || !started_at || !status || !checklist_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Char(36), crypto.randomUUID())
      .input("vehicle_id", sql.Char(36), vehicle_id)
      .input("driver_id", sql.Char(36), driver_id)
      .input("inspection_type", sql.VarChar(20), inspection_type)
      .input("started_at", sql.DateTime, started_at)
      .input("completed_at", sql.DateTime, completed_at || null)
      .input("status", sql.VarChar(20), status)
      .input("signed_by", sql.Char(36), signed_by || null)
      .input("checklist_id", sql.Char(36), checklist_id)
      .query(`
        INSERT INTO GREENKEYPER.Inspections (id, vehicle_id, driver_id, inspection_type, started_at, completed_at, status, signed_by, checklist_id)
        VALUES (@id, @vehicle_id, @driver_id, @inspection_type, @started_at, @completed_at, @status, @signed_by, @checklist_id)
      `);
    res.status(201).json({ message: "Inspection created successfully!" });
  } catch (err) {
    console.error("Error creating inspection:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get inspection by id
exports.getInspectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Char(36), id)
      .query('SELECT * FROM GREENKEYPER.Inspections WHERE id = @id');
    if (!result.recordset.length) {
      return res.status(404).json({ message: 'Inspection not found' });
    }
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching inspection:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get inspections by vehicle id
exports.getInspectionsByVehicleId = async (req, res) => {
  try {
    const { vehicle_id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('vehicle_id', sql.Char(36), vehicle_id)
      .query('SELECT * FROM GREENKEYPER.Inspections WHERE vehicle_id = @vehicle_id');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching inspections by vehicle:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update inspection by id
exports.updateInspection = async (req, res) => {
  try {
    const { id } = req.params;
    const { vehicle_id, driver_id, inspection_type, started_at, completed_at, status, signed_by, checklist_id } = req.body;
    const pool = await poolPromise;
    let query = 'UPDATE GREENKEYPER.Inspections SET ';
    const updates = [];
    if (vehicle_id) updates.push('vehicle_id = @vehicle_id');
    if (driver_id) updates.push('driver_id = @driver_id');
    if (inspection_type) updates.push('inspection_type = @inspection_type');
    if (started_at) updates.push('started_at = @started_at');
    if (completed_at) updates.push('completed_at = @completed_at');
    if (status) updates.push('status = @status');
    if (signed_by) updates.push('signed_by = @signed_by');
    if (checklist_id) updates.push('checklist_id = @checklist_id');
    if (updates.length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }
    query += updates.join(', ');
    query += ' WHERE id = @id';
    const request = pool.request().input('id', sql.Char(36), id);
    if (vehicle_id) request.input('vehicle_id', sql.Char(36), vehicle_id);
    if (driver_id) request.input('driver_id', sql.Char(36), driver_id);
    if (inspection_type) request.input('inspection_type', sql.VarChar(20), inspection_type);
    if (started_at) request.input('started_at', sql.DateTime, started_at);
    if (completed_at) request.input('completed_at', sql.DateTime, completed_at);
    if (status) request.input('status', sql.VarChar(20), status);
    if (signed_by) request.input('signed_by', sql.Char(36), signed_by);
    if (checklist_id) request.input('checklist_id', sql.Char(36), checklist_id);
    await request.query(query);
    res.status(200).json({ message: 'Inspection updated successfully!' });
  } catch (err) {
    console.error('Error updating inspection:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete inspection by id
exports.deleteInspection = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Char(36), id)
      .query('DELETE FROM GREENKEYPER.Inspections WHERE id = @id');
    res.status(200).json({ message: 'Inspection deleted successfully!' });
  } catch (err) {
    console.error('Error deleting inspection:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const sql = require("mssql");
const poolPromise = require("../db");

// Create vehicle
exports.createVehicle = async (req, res) => {
	try {
		const { driver_id, plate_number, make, model, year, status, current_odometer } = req.body;

		if (!driver_id || !plate_number || !make || !model || !status) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		const pool = await poolPromise;
		await pool.request()
			.input("id", sql.Char(36), crypto.randomUUID())
			.input("driver_id", sql.Char(36), driver_id)
			.input("plate_number", sql.VarChar(32), plate_number)
			.input("make", sql.VarChar(64), make)
			.input("model", sql.VarChar(64), model)
			.input("year", sql.Int, year || null)
			.input("status", sql.VarChar(20), status)
			.input("current_odometer", sql.BigInt, current_odometer || null)
			.query(`
				INSERT INTO GREENKEYPER.Vehicles (id, driver_id, plate_number, make, model, year, status, current_odometer)
				VALUES (@id, @driver_id, @plate_number, @make, @model, @year, @status, @current_odometer)
			`);

		res.status(201).json({ message: "Vehicle created successfully!" });
	} catch (err) {
		console.error("Error creating vehicle:", err);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Get vehicle by id
exports.getVehicle = async (req, res) => {
	try {
		const { id } = req.params;
		const pool = await poolPromise;
		const result = await pool.request()
			.input('id', sql.Char(36), id)
			.query('SELECT * FROM GREENKEYPER.Vehicles WHERE id = @id');
		if (result.recordset.length === 0) {
			return res.status(404).json({ message: 'Vehicle not found' });
		}
		res.status(200).json(result.recordset[0]);
	} catch (err) {
		console.error('Error fetching vehicle:', err);
		res.status(500).json({ message: 'Internal server error' });
	}
};

// Delete vehicle by id
exports.deleteVehicle = async (req, res) => {
	try {
		const { id } = req.params;
		const pool = await poolPromise;
		await pool.request()
			.input('id', sql.Char(36), id)
			.query('DELETE FROM GREENKEYPER.Vehicles WHERE id = @id');
		res.status(200).json({ message: 'Vehicle deleted successfully!' });
	} catch (err) {
		console.error('Error deleting vehicle:', err);
		res.status(500).json({ message: 'Internal server error' });
	}
};

// Update vehicle info
exports.updateVehicle = async (req, res) => {
	try {
		const { id } = req.params;
		const { driver_id, plate_number, make, model, year, status, current_odometer } = req.body;
		const pool = await poolPromise;

		// Build dynamic SQL for updating only provided fields
		let query = 'UPDATE GREENKEYPER.Vehicles SET ';
		const updates = [];
		if (driver_id) updates.push('driver_id = @driver_id');
		if (plate_number) updates.push('plate_number = @plate_number');
		if (make) updates.push('make = @make');
		if (model) updates.push('model = @model');
		if (year !== undefined) updates.push('year = @year');
		if (status) updates.push('status = @status');
		if (current_odometer !== undefined) updates.push('current_odometer = @current_odometer');
		query += updates.join(', ');
		query += ' WHERE id = @id';

		const request = pool.request().input('id', sql.Char(36), id);
		if (driver_id) request.input('driver_id', sql.Char(36), driver_id);
		if (plate_number) request.input('plate_number', sql.VarChar(32), plate_number);
		if (make) request.input('make', sql.VarChar(64), make);
		if (model) request.input('model', sql.VarChar(64), model);
		if (year !== undefined) request.input('year', sql.Int, year);
		if (status) request.input('status', sql.VarChar(20), status);
		if (current_odometer !== undefined) request.input('current_odometer', sql.BigInt, current_odometer);

		await request.query(query);
		res.status(200).json({ message: 'Vehicle info updated successfully!' });
	} catch (err) {
		console.error('Error updating vehicle info:', err);
		res.status(500).json({ message: 'Internal server error' });
	}
};

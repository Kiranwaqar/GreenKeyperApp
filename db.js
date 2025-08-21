require('dotenv').config();
const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER,        
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,

  options: {
    encrypt: true,                 
    trustServerCertificate: true  
  },
 
};

async function connectDB() {
  try {
    const pool = await sql.connect(config);
    console.log('Connected to SQL Server');
    const { recordset } = await pool.request().query('SELECT DB_NAME() AS db, SUSER_SNAME() AS login, GETDATE() AS now');
    console.log(recordset);
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

connectDB();

module.exports = sql;

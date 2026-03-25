const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
  console.log('Testing connection to:', process.env.DATABASE_URL.split('@')[1]);
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    console.log('Successfully connected to MySQL!');
    await connection.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

test();

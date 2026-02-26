const express = require('express');
require("dotenv").config();
const pool = require('./db.js');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as count FROM tickets");
    res.json({ ticketsInDatabase: rows[0].count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server is running"));
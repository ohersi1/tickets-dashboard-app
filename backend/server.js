const express = require("express");
require("dotenv").config();
const pool = require("./db.js");
const app = express();
app.use(express.json());

app.post("/api/tickets", async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        error: "Please enter a title AND description for your ticket!",
      });
    }
    const validatedPriority = priority || "MEDIUM";
    const [result] = await pool.query(
      `INSERT INTO tickets (title, description, priority) VALUES (?, ?, ?)`,
      [title.trim(), description.trim(), validatedPriority],
    );
    res.status(201).json({
      title: title.trim(),
      description: description.trim(),
      priority: validatedPriority,
      status: "OPEN",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
app.get("/", (req, res) => {
  res.send("Hello World!");
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

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

app.get("/api/tickets", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const priority = req.query.priority;
    const search = req.query.search?.trim();

    let query = `SELECT * FROM tickets`;
    let countQuery = `SELECT COUNT(*) AS totalTickets FROM tickets`;

    let conditions = [];
    let params = [];

    if (status) {
      conditions.push("status = ?");
      params.push(status);
    }

    if (priority) {
      conditions.push("priority = ?");
      params.push(priority);
    }

    if (search) {
      const searchTerm = `%${search}%`;
      conditions.push("(title LIKE ? OR description LIKE ?)");
      params.push(searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
      countQuery += " WHERE " + conditions.join(" AND ");
    }
    let filterParams = [...params];
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [results] = await pool.query(query, params);

    const [countResults] = await pool.query(countQuery, filterParams);

    const totalTickets = countResults[0].totalTickets;
    const totalPages = Math.ceil(totalTickets / limit);
    res.status(200).json({
      page,
      limit,
      totalTickets,
      results,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

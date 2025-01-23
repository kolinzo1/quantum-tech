const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createPool({
  host: "localhost",
  user: "kolinzo",
  password: "Thisaccess1#",
  database: "quantum",
});

// User Registration
app.post("/api/register", async (req, res) => {
  const { username, password, email } = req.body;

  // Password validation
  if (password.length < 8 || !/\d/.test(password)) {
    return res.status(400).json({
      error: "Password must be at least 8 characters and contain a number",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)",
        [username, hashedPassword, email]
      );
    res.json({ message: "Registration successful" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Username already exists" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

// User Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE username = ?", [username]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, users[0].password_hash);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: users[0].user_id }, "your_jwt_secret", {
      expiresIn: "24h",
    });

    res.json({
      token,
      userId: users[0].user_id, // Include userId in response
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get Categories
app.get("/api/categories", async (req, res) => {
  try {
    const [categories] = await db.promise().query("SELECT * FROM categories");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});

// Get questions for a specific category
app.get("/api/categories/:categoryId/questions", async (req, res) => {
  try {
    const [questions] = await db.promise().query(
      `
          SELECT 
              q.question_id,
              q.title,
              q.content,
              q.created_at,
              u.username,
              (SELECT COUNT(*) FROM answers WHERE question_id = q.question_id) as answer_count
          FROM questions q
          JOIN users u ON q.user_id = u.user_id
          WHERE q.category_id = ?
          ORDER BY q.created_at DESC`,
      [req.params.categoryId]
    );
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// Create a new question
app.post("/api/questions", async (req, res) => {
  const { categoryId, title, content, userId } = req.body;

  try {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO questions (category_id, user_id, title, content) VALUES (?, ?, ?, ?)",
        [categoryId, userId, title, content]
      );
    res.json({
      message: "Question created successfully",
      questionId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ error: "Failed to create question" });
  }
});

// Get a specific question with details
app.get("/api/questions/:questionId", async (req, res) => {
  try {
    const [questions] = await db.promise().query(
      `
          SELECT 
              q.question_id,
              q.title,
              q.content,
              q.created_at,
              u.username,
              q.category_id
          FROM questions q
          JOIN users u ON q.user_id = u.user_id
          WHERE q.question_id = ?`,
      [req.params.questionId]
    );

    if (questions.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(questions[0]);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ error: "Failed to fetch question" });
  }
});

// Get answers for a specific question
app.get("/api/questions/:questionId/answers", async (req, res) => {
  try {
    const [answers] = await db.promise().query(
      `
          SELECT 
              a.answer_id,
              a.content,
              a.created_at,
              u.username,
              a.is_accepted
          FROM answers a
          JOIN users u ON a.user_id = u.user_id
          WHERE a.question_id = ?
          ORDER BY a.is_accepted DESC, a.created_at DESC`,
      [req.params.questionId]
    );
    res.json(answers);
  } catch (error) {
    console.error("Error fetching answers:", error);
    res.status(500).json({ error: "Failed to fetch answers" });
  }
});

// Post a new answer
app.post("/api/questions/:questionId/answers", async (req, res) => {
  const { content, userId } = req.body;
  const questionId = req.params.questionId;

  console.log("Received answer data:", { questionId, content, userId });

  try {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO answers (question_id, user_id, content) VALUES (?, ?, ?)",
        [questionId, userId, content]
      );
    console.log("Answer inserted:", result);

    res.json({
      message: "Answer posted successfully",
      answerId: result.insertId,
    });
  } catch (error) {
    console.error("Error posting answer:", error);
    res.status(500).json({ error: "Failed to post answer: " + error.message });
  }
});

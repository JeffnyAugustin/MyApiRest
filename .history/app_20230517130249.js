const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config({ path: "./.env" });
const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Connection successful");
    }
});

app.use(express.json());

// Generate JWT token
function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN
    };

    return jwt.sign(payload, process.env.JWT_SECRET, options);
}


function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "Access denied. Token missing." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
        return res.status(401).json({ error: "Invalid token." });
    }

    req.user = decoded;
    next();

    });
}

// Create a new user
app.post("/user", (req, res) => {
    const { name, password, role, email } = req.body;

    bcrypt.hash(password, 10, (error, hashedPassword) => {
    if (error) {
        console.log(error);
        res.status(500).json({ error: "Operation failed" });
    } else {
        const newUser = { name, password: hashedPassword, role, email };
        db.query("INSERT INTO users SET ?", newUser, (error, result) => {
        if (error) {
        console.log(error);
        res.status(500).json({ error: "Operation failed" });
        } else {
        const user = { id: result.insertId, ...newUser };
        const token = generateToken(user);
        res.status(201).json({
        message: "User created successfully",
        token: token,
            
        });
        }
        });
    }
    });
});

// Retrieve all users (protected route)
app.get("/users", verifyToken, (req, res) => {
  db.query("SELECT * FROM users", (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to retrieve users" });
        } else {
        res.status(200).json(results);
        }
    });
});

// Retrieve a specific user (protected route)
app.get("/user/:id", verifyToken, (req, res) => {
    const userId = req.params.id;

  db.query("SELECT * FROM users WHERE id = ?", userId, (error, results) => {
    if (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to retrieve the user" });
    } else if (results.length === 0) {
        res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

// Update a user (protected route)
app.put("/user/:id", verifyToken, (req, res) => {
  const userId = req.params.id;
  const { name, password, role, email } = req.body;
  const updatedUser = { name, password, role, email };

  db.query(
    "UPDATE users SET ? WHERE id = ?",
    [updatedUser, userId],
    (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to update the user" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.status(200).json({ message: "User updated successfully" });
      }
    }
  );
});

// Delete a user (protected route)
app.delete("/user/:id", verifyToken, (req, res) => {
  const userId = req.params.id;

  db.query("DELETE FROM users WHERE id = ?", userId, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to delete the user" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json({ message: "User deleted successfully" });
    }
  });
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", email, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to login" });
    } else if (results.length === 0) {
      res.status(401).json({ error: "Invalid email or password" });
    } else {
      const user = results[0];
      bcrypt.compare(password, user.password, (error, isMatch) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Failed to login" });
        } else if (isMatch) {
          const token = generateToken(user);
          res.status(200).json({
            message: "Login successful",
            token: token,
          });
        } else {
          res.status(401).json({ error: "Invalid email or password" });
        }
      });
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
 
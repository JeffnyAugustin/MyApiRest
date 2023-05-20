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

// Générer JWT token
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

// // Vérifier Token

// function verifyToken(req, res, next) {
//     const token = req.headers.authorization;

//     if (!token) {
//         return res.status(401).json({ error: "Access denied. Token missing." });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
//     if (error) {
//         return res.status(401).json({ error: "Invalid token." });
//     }

//     req.user = decoded;
//     next();

//     });
// }

// Créer un nouvel utilisateur : 

app.post("/user", (req, res) => {
    const { lastName, firstName, passWord, role, email } = req.body;

    bcrypt.hash(passWord, 10, (error, hashedPassword) => {
    if (error) {
        console.log(error);
        res.status(500).json({ error: "Operation failed" });
    } else {
        const newUser = { lastName, firstName, passWord: hashedPassword, role, email };
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
app.get("/users", (req, res) => {
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
app.get("/user/:id", (req, res) => {
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
app.put("/user/:id", (req, res) => {
    const userId = req.params.id;
    const { lastName, firstName, passWord, role, email } = req.body;
    const updatedUser = { lastName, firstName, passWord, role, email };

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
app.delete("/user/:id", (req, res) => {
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

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401)
    }
    req.user = user;
    next();
  });
}

app.get('/user/me', authenticateToken, (req, res) => {
  res.send(req.user);
});




// Start the server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});

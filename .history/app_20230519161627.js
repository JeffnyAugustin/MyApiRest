const express = require("express");
const dotenv = require("dotenv");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userCtrl = require("./controllers/userController");


dotenv.config({ path: "./.env" });

const app = express();



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

app.post("/user", userController);

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
    const idUser = req.params.id;

  db.query("SELECT * FROM users WHERE id = ?", idUser, (error, results) => {
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
    const idUser = req.params.id;
    const { lastName, firstName, passWord, role, email } = req.body;
    const updatedUser = { lastName, firstName, passWord, role, email };

    db.query("UPDATE users SET ? WHERE id = ?", [updatedUser, idUser], (error, result) => {
        if (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to update the user" });
        } else if (result.affectedRows === 0) {
        res.status(404).json({ error: "User not found" });
        } else {
        res.status(200).json({ message: "User updated successfully" });
        }
    });
});

// Delete a user (protected route)
app.delete("/user/:id", (req, res) => {
    const idUser = req.params.id;

    db.query("DELETE FROM users WHERE id = ?", idUser, (error, result) => {
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

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]

//   if (token == null) return res.sendStatus(401)

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) {
//       return res.sendStatus(401)
//     }
//     req.user = user;
//     next();
//   });
// }


// function authenticateToken (req, res, next) {
//     const token = req.headers.authorization;

//     if (!token) {
//         return res.status(401).json({ message: "Access denied. Token missing."  });
//     }

//     try {
//         const decoded = jwt.verify(token, 'my-secret-key');
//         req.user = decoded; // Ajoute les informations utilisateur au req object
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: 'Invalid token' });
//     }
// };



// app.get('/me', authenticateToken, (req, res) => {
//     // ID de l'utilisateur extrait du jeton JWT ou de la session
//     const idUser = req.user.id
//     // Récupérer les informations de l'utilisateur à partir des données stockées
//     const user = getUserById(userId);
//     if (!user) {
//     return res.status(404).json({ message: 'User not found' });
//     }

//     res.json(user);
    
// });



// Start the server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});

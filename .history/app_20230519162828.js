
const userCtrl = require("./controllers/userController");

const express = require("express");
const dotenv = require("dotenv");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

app.post("/user", userCtrl.addUser);

// Retrieve all users (protected route)
app.get("/users", userCtrl.getAllUsers);

// Retrieve a specific user (protected route)
app.get("/user/:id", userCtrl.selectUser);

// Update a user (protected route)
app.put("/user/:id", userCtrl.updateUser);

// Delete a user (protected route)
app.delete("/user/:id", userCtrl.deleteUser);

// Login route
app.post("/login", );

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

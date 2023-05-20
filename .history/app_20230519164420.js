
const userCtrl = require("./controllers/userController");

const express = require("express");
const dotenv = require("dotenv");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userController = require("./controllers/userController");

dotenv.config({ path: "./.env" });

const app = express();



app.use(express.json());



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
app.post("/login", userController.loginUser);

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


const userCtrl = require("./controllers/userController");
const jwtTools = requi

const express = require("express");
const dotenv = require("dotenv");

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
app.post("/login", userCtrl.loginUser);


app.get('/me', userCtrl.loggedUser );



// Start the server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});

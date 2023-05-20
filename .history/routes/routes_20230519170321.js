const express = require("express");
const userCtrl = require("./controllers/userController");
const jwtTools = require("./jwtTools");


exports.router = (() => {
    const userRouter = express.Router();

    //Routes
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


app.get('/me', jwtTools.authenticateToken, userCtrl.loggedUser);

    //User
    userRouter.route('/addUser/').post(userCtrl.addUser);
    userRouter.route('/updateUser/').put(userCtrl.updateUser);
    userRouter.route('/deleteUser/').delete(userCtrl.deleteUser);
    userRouter.route('/user/me').get(jwtTools.authenticateToken, userCtrl.loggedUser);
    userRouter.route('/user/:id').get(userCtrl.selectUser);
    userRouter.route('/users/').get(userCtrl.getAllUsers);
    userRouter.route('/login/').post(userCtrl.loginUser)
    return userRouter;
})();

const express = require("express");
const userCtrl = require("../controllers/userController");
const jwtTools = require("../jwtTools");
const db = require("../db");


exports.router = (() => {
    const userRouter = express.Router();

    //Routes User
    userRouter.route('/user/').post(userCtrl.addUser);
    userRouter.route('/update/user/:id').put(userCtrl.updateUser);
    userRouter.route('/delete/user/:id').delete(userCtrl.deleteUser);
    userRouter.route('/user/:idUser').get(userCtrl.selectUser);
    userRouter.route('/users').get(userCtrl.getAllUsers);
    userRouter.route('/login').post(userCtrl.loginUser)
    userRouter.route('/me').get(jwtTools.authenticateToken, userCtrl.loggedUser);
    return userRouter;
})();

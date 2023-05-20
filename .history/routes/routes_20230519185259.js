const express = require("express");
const userCtrl = require("../controllers/userController");
const jwtTools = require("../jwtTools");


exports.router = (() => {
    const userRouter = express.Router();

    //Routes User
    userRouter.route('/user/').post(userCtrl.addUser);
    userRouter.route('/user/:id').put(userCtrl.updateUser);
    userRouter.route('/user/:id').delete(userCtrl.deleteUser);
    userRouter.route('/me').get(jwtTools.authenticateToken, userCtrl.loggedUser);
    userRouter.route('/user/:id').get(userCtrl.selectUser);
    userRouter.route('/users').get(userCtrl.getAllUsers);
    userRouter.route('/login').post(userCtrl.loginUser)
    return userRouter;
})();

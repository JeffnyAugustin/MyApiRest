const express = require("express");


exports.router = (() => {
    const userRouter = express.Router();

    //Routes

    //User
    userRouter.route('/addUser/').post(userstrl.addUser);
    userRouter.route('/updateUser/').put(userCtrl.updateUser);
    userRouter.route('/deleteUser/').delete(userCtrl.deleteUser);
    userRouter.route('/user/me').get(userCtrl.getUserMe);
    userRouter.route('/user/:id').get(userCtrl.getUser);
    userRouter.route('/users/').get(userCtrl.getAllUsers);
    userRouter.route('/login/').post(use)
})

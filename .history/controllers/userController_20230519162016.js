const express = require("express");
const dotenv = require("../dotenv");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config({ path: "./.env" });

const app = express();


module.exports = {
    addUser: (req, res) => {
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
    }
}
const dotenv = require("dotenv");
const db = require("../db");
const bcrypt = require("bcryptjs");


dotenv.config({ path: "../.env"});



module.exports = {
    addUser: (req, res) => {
        const { lastName, firstName, passWord, role, email } = req.body;
        bcrypt.hash(passWord, 10, (error, hashedPassword) => {
        if (error) {
            console.log(error);
            res.status(400).json({ message: "An error occurred"  });
        } else {
            const newUser = { lastName, firstName, passWord: hashedPassword, role, email };
            db.query("INSERT INTO users SET ?", newUser, (error, result) => {
            if (error) {
            console.log(error);
            res.status(400).json({ message: "An error occurred" });
            } else {
            const user = { id: result.insertId, ...newUser };
            const token = generateToken(user);
            res.status(201).json({
            message: "User successfully created",
            token: token,
                
            });
            }
            });
        }
        });
    },

    updateUser: (req, res) => {
        const id = req.params.id;
        const { lastName, firstName, passWord, role, email } = req.body;
        const updatedUser = { lastName, firstName, passWord, role, email };

        db.query("UPDATE users SET ? WHERE idUser = ?", [updatedUser, id], (error, result) => {
            if (error) {
            console.log(error);
            res.status(400).json({ error: " An error occurred" });
            } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "User not found" });
            } else {
            res.status(200).json({ message: "User successfully modified" });
            }
        });
    },

    deleteUser: (req, res) => {
        const id = req.params.id;

        db.query("DELETE FROM users WHERE idUser = ?", id, (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: "An error occurred" });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json({ message: "User successfully deleted" });
        }
        });
    },

    selectUser: (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM users WHERE idUser = ?", id, (error, results) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: "an error occurred" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json(results[0]);
        }
        });
    },

    getAllUsers: (req, res) => {
    db.query("SELECT * FROM users", (error, results) => {
            if (error) {
                console.log(error);
                res.status(400).json({ error: " An error occurred" });
            } else {
            res.status(200).json(results);
            }
        });
    },

    loginUser: (req, res) => {
        const { email, password } = req.body;
        db.query("SELECT * FROM users WHERE email = ?", email, (error, results) => {
            if (error) {
                console.log(error);
                res.status(400).json({ error: "Failed to login" });
            } else if (results.length === 0) {
                res.status(401).json({ error: "Invalid email or password" });
            } else {
                const user = results[0];
                bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) {
                console.log(error);
                res.status(400).json({ error: "Failed to login" });
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
    },

    loggedUser: (req, res) => {
        // ID de l'utilisateur extrait du jeton JWT ou de la session
        const idUser = req.user.idUser
        // Récupérer les informations de l'utilisateur à partir des données stockées
        const user = getUserById(idUser);
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }else{
        res.json(user);
        }
    }

}
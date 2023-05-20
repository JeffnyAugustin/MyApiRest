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
    },

    getAllUsers: (req, res) => {
    db.query("SELECT * FROM users", (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).json({ error: "Failed to retrieve users" });
            } else {
            res.status(200).json(results);
            }
        });
    },

    selectUser: (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM users WHERE idUser = ?", [id, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to retrieve the user" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json(results[0]);
        }
        });
    },

    updateUser: (req, res) => {
        const idUser = req.params.idUser;
        const { lastName, firstName, passWord, role, email } = req.body;
        const updatedUser = { lastName, firstName, passWord, role, email };

        db.query("UPDATE users SET ? WHERE idUser = ?", [updatedUser, idUser], (error, result) => {
            if (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to update the user" });
            } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "User not found" });
            } else {
            res.status(200).json({ message: "User updated successfully" });
            }
        });
    },

    deleteUser: (req, res) => {
        const idUser = req.params.idUser;

        db.query("DELETE FROM users WHERE idUser = ?", idUser, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to delete the user" });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json({ message: "User deleted successfully" });
        }
        });
    },

    loginUser: (req, res) => {
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
    },

    loggedUser: (req, res) => {
        // ID de l'utilisateur extrait du jeton JWT ou de la session
        const idUser = req.user.idUser
        // Récupérer les informations de l'utilisateur à partir des données stockées
        const user = getUserById(idUser);
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
        
    }

}
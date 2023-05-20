const mysql = require("mysql");


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    charset:UTF8 	utf8mb3_general_ci 	
});

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Connection successful");
    }
});



module.exports = db;
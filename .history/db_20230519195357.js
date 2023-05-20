const mysql = require("mysql");

dotenv.config({ path: "./.env"});

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    charset:utf8mb3_general_ci 	
});

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Connection successful");
    }
});



module.exports = db;
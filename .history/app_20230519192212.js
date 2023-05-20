const express = require("express");
const router = require("./routes/routes").router;

// const dotenv = require("dotenv");


// dotenv.config({ path: "../.env" });

const app = express();



const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Connection successful");
    }
});


app.use(express.json());
app.use("/", router);



// Start the server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});

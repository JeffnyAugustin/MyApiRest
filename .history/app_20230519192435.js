const express = require("express");
const router = require("./routes/routes").router;

// const dotenv = require("dotenv");


// dotenv.config({ path: "../.env" });

const app = express();


const mysql = require("mysql");





app.use(express.json());
app.use("/", router);



// Start the server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});

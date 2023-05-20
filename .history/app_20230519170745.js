
const userCtrl = require("./controllers/userController");
const jwtTools = require("./jwtTools");
const router = require("")


const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = express();


app.use(express.json());







// Start the server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});

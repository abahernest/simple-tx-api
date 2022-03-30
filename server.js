import { config } from "dotenv";
import express, { json, urlencoded } from "express";
import cors from "cors";
// import {connectDB} from "./config/database.js"

config({ path: ".env" });
const app = express();
const PORT = process.env.PORT ||  5000
//Import Routes
import UserRouter from "./routes/users.route.js"
import TransactionRouter from "./routes/transactions.route.js"

// Engine Setup
// parse application/json
app.use(json());

//CORS
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));

//Allow all requests from all domains & localhost
app.all("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-Access-Token, XKey, Authorization, Observe");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE");
    next();
});


app.use("/users",UserRouter)
app.use("/transactions", TransactionRouter)

// connectDB.connect((error)=>{
//     if (error) throw error
//     app.listen(PORT, () => {
//             console.log(`#####🛡️  Server listening on port: ${PORT} 🛡️####`);
//     });
// })


app.listen(PORT, () => {
        console.log(`#####🛡️  Server listening on port: ${PORT} 🛡️####`);
});

import { config } from "dotenv";
import express, { json, urlencoded } from "express";
import cors from "cors";
import * as Sentry from "@sentry/node"
import * as Tracing from "@sentry/tracing"
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

//Initialize Sentry
Sentry.init({
    dsn:"",
    integrations:[
        //enable HTTP calls tracing
        new Sentry.Integrations.Http({tracing:true}),
        //enable Express.js middleware tracing
        new Tracing.Integrations.Express({app}),
    ],

    // set traceSampleRate to 1.0 to capture 100&
    // of transactions for performance monitoring.
    tracesSampleRate: 1.0
})

//CORS
app.use(cors());

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
//TracingHandler creates a trace for every incoming request
app.use (Sentry.Handlers.tracingHandler());

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

//Sentry Error Handler placed before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.listen(PORT, () => {
        console.log(`#####🛡️  Server listening on port: ${PORT} 🛡️####`);
});

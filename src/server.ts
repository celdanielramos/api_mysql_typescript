import express, { Request, Response } from "express";
import db from "./utils/db";

import transactionCtrl from "./controllers/transaction";
import paymentnoteCtrl from "./controllers/paymentnote";

import 'dotenv/config'

const port: any = process.env.PORT; 

db.sync().then(() => {
    console.log("*** DB connected");
});

const app = express();

// To read the body
app.use(express.json());

// Routes
app.use("/api/v1/transaction", transactionCtrl);
app.use("/api/v1/paymentnote", paymentnoteCtrl);

app.listen(port, () => {
    console.log("*** Server is running in port " + port);
});

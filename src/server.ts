import express, { Request, Response } from "express";
import db from "./utils/db";

import { Transaction } from "./models/transaction";
import { Paymentnote } from "./models/paymentnote";

import { v4 as uuidv4 } from "uuid";
import { Op, QueryTypes } from "sequelize";

// Interfaces
interface iTransaction {
	transaction_uuid: string;
	transaction_status_code: string;
	transaction_value: Number;
    transaction_datetime: Date;
    transaction_payment_note_uuid: string;
}

interface iPaymentnoteWithTransactions {
    payment_note_uuid: string;
    payment_note_created_datetime: Date;
    payment_note_period_from_datetime: Date;
    payment_note_period_to_datetime: Date;
    payment_note_transactions_count: Number;
    payment_note_value: Number;
    payment_note_status_code: string;
    transactions: iTransaction[]
}

db.sync().then(() => {
    console.log("*** DB connected");
});

const app = express();
const port = 9000;

// To read the body
app.use(express.json());

// Routes
app.get("/transaction", async (req: Request, res: Response) => {
    try {
        const limit: number = Number(req.query.limit) || 10;
        const offset: number = Number(req.query.offset) || 0;

        const records = await Transaction.findAll({ where: {}, limit, offset });

        return res.json(records);
    } catch (e) {
        return res.json({ msg: "transaction failed", status: 500 });
    }
});

app.get("/transaction/:uuid", async (req: Request, res: Response) => {
    try {
        const uuid: string = req.params.uuid;

        const record = await Transaction.findByPk(uuid);

        if (!record) {
            res.status(404);
        }
    
        return res.json(record);
    } catch (e) {
        return res.json({ msg: "transaction by uuid failed", status: 500 });
    }
});

app.get("/paymentnote", async (req: Request, res: Response) => {
    try {
        const limit: number = Number(req.query.limit) || 10;
        const offset: number = Number(req.query.offset) || 0;

        const records = await Paymentnote.findAll({ where: {}, limit, offset });

        return res.json(records);
    } catch (e) {
        return res.json({ msg: "paymentnote failed", status: 500 });
    }
});

app.get("/paymentnote/:uuid", async (req: Request, res: Response) => {
    try {
        const uuid: string = req.params.uuid;

        const paymentnote: any = await Paymentnote.findByPk(uuid);

        if (!paymentnote) {
            res.status(404);
        }

        const data: any = await Transaction.findAll({
            where: { transaction_payment_note_uuid: uuid }
        });
    
        // Build the response
        const result: iPaymentnoteWithTransactions = {
            payment_note_uuid: paymentnote.payment_note_uuid,
            payment_note_created_datetime: paymentnote.payment_note_created_datetime,
            payment_note_period_from_datetime: paymentnote.payment_note_period_from_datetime,
            payment_note_period_to_datetime: paymentnote.payment_note_period_to_datetime,
            payment_note_transactions_count: paymentnote.payment_note_transactions_count,
            payment_note_value: paymentnote.payment_note_value,
            payment_note_status_code: paymentnote.payment_note_status_code,
            transactions: data || []
        };
    
        res.json(result);
    } catch (e) {
        return res.json({ msg: "paymentnote by uuid failed", status: 500 });
    }
});

app.post("/paymentnote", async (req: Request, res: Response) => {
    if (!req.body.period_from || !req.body.period_to) {
        res.status(404).send({ error: 'Must provide period_from and preiod_to' });
    }

    const paymentnote: any = await Paymentnote.create({
        payment_note_uuid: uuidv4(),
        payment_note_created_datetime: new Date(),
        payment_note_period_from_datetime: req.body.period_from,
        payment_note_period_to_datetime: req.body.period_to, 
        payment_note_transactions_count: 0,
        payment_note_value: 0,
        payment_note_status_code: "CREATING"
    });

    const transactions: any = await Transaction.findAndCountAll({
        where: {
            transaction_status_code: "PENDING",
            transaction_datetime: {
                [Op.gte]: paymentnote.payment_note_period_from_datetime,
                [Op.lt]: paymentnote.payment_note_period_to_datetime
            }
        }
    });

    let total: number = 0;
    const uuids: string[] = [];

    if (transactions.count > 0) {
        transactions.rows.forEach((transaction: any) => {
            total = total + parseFloat(transaction.transaction_value);
            uuids.push(transaction.transaction_uuid);
        });

        const sUuids: string = "'" + uuids.join("','") + "'";

        // Massive update
        const sql: string = `
              UPDATE transaction
              SET 
                transaction_status_code = 'PAID',
                transaction_payment_note_uuid = '${paymentnote.payment_note_uuid}'
              WHERE transaction_uuid IN(${sUuids});
        `;

        await db.query(sql, { type: QueryTypes.UPDATE });

        Paymentnote.update(
            // attributes
            {
                payment_note_status_code: "COMPLETED",
                payment_note_value: total,
                payment_note_transactions_count: transactions.count
            },
            // where
            {
                where: { payment_note_uuid: paymentnote.payment_note_uuid }
            }
        );
    }

    res.json({
        payment_note_uuid: paymentnote.payment_note_uuid
    });
});


app.listen(port, () => {
    console.log("*** Server is running in port " + port);
});
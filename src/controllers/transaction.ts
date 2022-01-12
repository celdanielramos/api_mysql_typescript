import express from 'express';
import { Request, Response } from "express";

import { Transaction } from "../models/transaction";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const limit: number = Number(req.query.limit) || 10;
        const offset: number = Number(req.query.offset) || 0;

        const transactions = await Transaction.findAll({ where: {}, limit, offset }) as Transaction[];

        return res.json(transactions);
    } catch (e) {
        return res.json({ msg: "transaction failed", status: 500 });
    }
});

router.get("/:uuid", async (req: Request, res: Response) => {
    try {
        const uuid: string = req.params.uuid;

        const transaction = await Transaction.findByPk(uuid) as Transaction;

        if (!transaction) {
            res.status(404);
        }
    
        return res.json(transaction);
    } catch (e) {
        return res.json({ msg: "transaction by uuid failed", status: 500 });
    }
});

export default router;

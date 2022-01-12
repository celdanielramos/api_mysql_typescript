import express from 'express';
import { Request, Response } from "express";

import { Transaction } from "../models/transaction";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const limit: number = Number(req.query.limit) || 10;
        const offset: number = Number(req.query.offset) || 0;

        const records = await Transaction.findAll({ where: {}, limit, offset });

        return res.json(records);
    } catch (e) {
        return res.json({ msg: "transaction failed", status: 500 });
    }
});

router.get("/:uuid", async (req: Request, res: Response) => {
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

export default router;

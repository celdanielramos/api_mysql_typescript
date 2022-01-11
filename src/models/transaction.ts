import { DataTypes, Model } from 'sequelize';
import db from '../utils/db';

interface TransactionAttributes {
	transaction_uuid: string;
	transaction_status_code: string;
	transaction_value: Number;
    transaction_datetime: Date;
    transaction_payment_note_uuid: string;
}

export class Transaction extends Model<TransactionAttributes> {}

Transaction.init(
    {
        transaction_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true
        },
        transaction_status_code: {
            type: DataTypes.STRING(255),
            allowNull:false
        },
        transaction_value: {
            type: DataTypes.FLOAT,
            allowNull:false
        },
        transaction_datetime: {
            type: DataTypes.DATE,
            allowNull:false
        },
        transaction_payment_note_uuid: {
            type: DataTypes.STRING(255),
            allowNull:false
        }
	},
	{
		sequelize: db,
		tableName: 'transaction',
        timestamps: false
	}
);

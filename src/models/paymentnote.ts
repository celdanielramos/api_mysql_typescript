import { DataTypes, Model } from 'sequelize';
import db from '../utils/db';

interface PaymentnoteAttributes {
    payment_note_uuid: string;
    payment_note_created_datetime: Date;
    payment_note_period_from_datetime: Date;
    payment_note_period_to_datetime: Date;
    payment_note_transactions_count: Number;
    payment_note_value: Number;
    payment_note_status_code: string;
}

export class Paymentnote extends Model<PaymentnoteAttributes> {}

Paymentnote.init(
    {
        payment_note_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true
        },
        payment_note_period_from_datetime	: {
            type: DataTypes.DATE,
            allowNull:false
        },
        payment_note_period_to_datetime	: {
            type: DataTypes.DATE,
            allowNull:false
        },
        payment_note_created_datetime	: {
            type: DataTypes.DATE,
            allowNull:false
        },
        payment_note_transactions_count: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        payment_note_value: {
            type: DataTypes.FLOAT,
            allowNull:false
        },
        payment_note_status_code: {
            type: DataTypes.STRING(255),
            allowNull:false
        }
    },
	{
		sequelize: db,
		tableName: 'payment_note',
        timestamps: false
	}
);

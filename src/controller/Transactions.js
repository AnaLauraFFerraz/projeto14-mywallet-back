import dayjs from "dayjs"
import { ObjectId } from "mongodb"
import db from "../config/database.js"

export async function listTransactions(req, res) {
    const { session } = res.locals

    try {
        const transactions = await db.collection("transactions")
            .find({ userId: ObjectId(session._id) }).toArray()

        return res.status(200).send(transactions)
    } catch (err) {
        console.log("listTransactions", err.message)
        res.sendStatus(500)
    }
}

export async function newIncome(req, res) {
    const { value, description } = req.body
    const { session } = res.locals
    const date = dayjs().format("DD/MM")

    let converted = Number(value).toFixed(2)

    try {
        await db.collection("transactions").insertOne({
            value: converted,
            description,
            date,
            userId: ObjectId(session._id)
        })

        res.sendStatus(201)
    } catch (err) {
        console.log("newIncome", err.message)
        res.sendStatus(500)
    }
}

export async function newExpense(req, res) {
    const { value, description } = req.body
    const { session } = res.locals
    const date = dayjs().format("DD/MM")

    let converted = -1.00 * Number(value)
    converted = converted.toFixed(2)

    try {
        await db.collection("transactions").insertOne({
            value: converted,
            description,
            date,
            userId: new ObjectId(session._id)
        })

        res.sendStatus(201)
    } catch (err) {
        console.log("newExpense", err.message)
        res.sendStatus(500)
    }
}
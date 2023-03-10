import bcrypt from "bcrypt"
import { v4 as uuidV4 } from "uuid"
import db from "../config/database.js"

export async function signUp(req, res) {
    const { name, email, password } = req.body

    const passwordHashed = bcrypt.hashSync(password, 10)

    try {
        const isExist = await db.collection("users").findOne({ email })

        if (isExist) return res.sendStatus(409)

        await db.collection("users").insertOne({ name, email, password: passwordHashed })

        res.status(201).send("SignUp OK!")
    } catch (err) {
        console.log("signUp", err.message)
        res.sendStatus(500)
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body

    try {
        const user = await db.collection("users").findOne({ email })

        if (!user) return res.status(400).send("Usuário ou senha incorretos")

        const isPassCorrect = bcrypt.compareSync(password, user.password)

        if (!isPassCorrect) return res.status(400).send("Usuário ou senha incorretos")

        const token = uuidV4();
        
        await db.collection("sessions").insertOne({ token, userId: user._id })

        return res.status(200).send(token)
    } catch (err) {
        console.log("signIn", err.message)
        res.sendStatus(500)
    }
}

// export async function signOut(req, res) {
//     const { user } = res.locals;
  
//     try {
//       await db.collection("sessions").deleteOne({ userId: new objectId(user._id) });
  
//       res.status(200).send("Usuário deslogado com sucesso!");
//     } catch (error) {
//       res.sendStatus(500);
//     }
//   }
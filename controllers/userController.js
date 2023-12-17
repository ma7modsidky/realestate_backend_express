// import expressAsyncHandler from "express-async-handler";
import AsyncHandler from "express-async-handler";
import {prisma} from "../config/prismaConfig.js";

export const createUser = AsyncHandler(async (req, res) => {
    console.log("Creating a user")
    let {email} = req.body
    console.log(email)
    const userExists = await prisma.user.findUnique({where: {email: email}})
    if (!userExists) {
        const user = await prisma.user.create({data: req.body})
        // 201 code for successful creation
        // 409 code for conflict - failed creation
        res.status(201).send({
            message: "User Created successfully",
            user: user,
        })
    }
    else {
        res.status(409).send({
            message: "User already exists",
        })
    }
})
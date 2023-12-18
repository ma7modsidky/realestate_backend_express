import AsyncHandler from "express-async-handler";
import {prisma} from "../config/prismaConfig.js";

export const getAllProperties = AsyncHandler(async (req, res) => {
    console.log("Get all properties")
    const properties = await prisma.property.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    res.status(200).send(properties)
})

export const getProperty = AsyncHandler(async (req, res) => {
    console.log("get single property")
    const {id}= req.params;
    try {
        const property = await prisma.property.findUnique({
            where: {id},
        })
        res.send(property)
    }catch(error) {
        throw new Error(error.message);
    }
})

export const createProperty = AsyncHandler(async (req, res) => {
    console.log("Create property")
    const {title, description, price, address, city, country, image, facilities, userEmail} = req.body.data
    console.log(req.body.data)
    try {
        const property = await prisma.property.create({data: {
            title, description, price, address, city, country, image, facilities, owner : {connect:{email: userEmail}},
        }})
        res.status(201).send({message: "Property created successfully", property})
    }catch(error) {
        if (error.code === "P2002") {
            throw new Error("A property with the same address already exists")
        }
        throw new Error(error.message)
}});


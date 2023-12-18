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

export const bookVisit = AsyncHandler(async (req, res) => {
    console.log("Book visit")
    const {id} = req.params
    const {email, date} = req.body
    try {
        alreadyBooked = await prisma.user.findUnique({
            where: {email},
            select: {bookedVisits: true}
        })
        if (alreadyBooked.bookedVisits.some(visit => visit.id === id)) {
            res.status(400).json({message: "the property is already booked by you"})
        }else {
            await prisma.user.update({
                where: {email},
                data: {bookedVisits: {push: {id,date}}},
            })
            res.status(200).json({message: "you have successfully booked a visit"})
        }

    }catch (e) {
        throw new Error(e.message)
    }
})

export const getAllBookings = AsyncHandler(async (req, res) => {
    const {email} = req.body
    try {
        const bookings = await prisma.user.findUnique({
            where: {email},
            select: {bookedVisits: true}
        })
        res.status(200).send(bookings)
    } catch (error) {
        throw new Error(error.message)
    }
})

export const cancelBooking = AsyncHandler(async (req,res) => {
    const {email} = req.body
    const {id} = req.params
    try {
        const user = await prisma.user.findUnique({
            where: {email},
            select: {bookedVisits: true} 
        })
        const index = user.bookedVisits.findIndex(visit => visit.id === id)   
        if (index === -1) {
            res.status(404).json({message: 'Booking not found'})
        }else {
            user.bookedVisits.splice(index, 1)
            await prisma.user.update({
                where: {email},
                date : {
                    bookedVisits: user.bookedVisits
                }
            })
        }
    } catch (error) {
        throw new Error(error.message)        
    } 
})


// add/remove properties from favorites list
export const toFav = AsyncHandler(async (req, res) => {
    const {email} = req.body
    // the property id in the uri
    const {pid} = req.params
    try {
        const user = await prisma.user.findUnique({
            where: {email},
        })
        // if the property id is already present in user favourites > remove it 
        if (user.favPropertiesIDs.includes(pid)) {
            const updateUser = await prisma.user.update({
                wehre : {email},
                data : {
                    favPropertiesIDs: {
                        set: user.favPropertiesIDs.filter(id => id !== pid)
                    }
                }
            })
            res.send({message: `Property ${pid} has been removed from favorites`})
        }else {
            const updateUser = await prisma.user.update({
                wehre : {email},
                data : {
                    favPropertiesIDs: {
                        push: pid
                    }
                }
            })
            res.send({message: `Property ${pid} has been added to favorites`})
        }
    } catch (error) {
        throw new Error(error.message)
    }
})
import express from "express";
import { bookVisit, createUser, getAllBookings, cancelBooking, toFav, getAllFavs} from "../controllers/userController.js";
const router = express.Router();

router.post("/register", createUser);
router.post("/bookVisit/:id", bookVisit);
router.get("/visits", getAllBookings)
router.delete("/visits/:id", cancelBooking);
router.post("/toFav/:pid", toFav);
router.get("/favorites", getAllFavs)
export {router as userRoute};

import express from "express";
import { 
  countByCity,
  countByType,
  createHotel, 
  deleteHotel, 
  getHotel, 
  getHotelRooms, 
  getHotels, 
  updateHotel 
} from "../controllers/hotel.js";
import { verifyAdmin } from "../utils/verifyToken.js";
// import { createError } from "../utils/error.js";

const router = express.Router();

// CREATE
router.post('/', createHotel);

// UPDATE
router.put("/:id", verifyAdmin, updateHotel);

// DELETE
router.delete("/:id", verifyAdmin, deleteHotel);

// GET
router.get("/find/:id", getHotel);

// GET ALL
router.get("/", getHotels);
// Adding frontend from Feature Component to get all
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);

export default router; 

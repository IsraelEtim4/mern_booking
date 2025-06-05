import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js"
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {

  // Add room id inside room array
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch(err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch(err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try{
    // After finding our hotel using this code
    // Note: findByIdAndUpdate will only return to previous document and not to update. To prevent this, we will add the {new: true} method
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      // we will update it with mongodb set method
      { $set: req.body},
      // below code will allow the input update both in api request and database
      { new: true }
      );
      // if it's sucessful, we're going to return this code
    res.status(200).json(updatedRoom);
  }catch(err){
    next(err);
  }
}

export const deleteRoom = async (req, res, next) => {
  // To update the hotel
  const hotelId = req.params.hotelid;
  try{
    // It's not going to return anything because we're deleting
    await Room.findByIdAndDelete(
      req.params.id
    );
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch(err) {
      next(err);
    }
    res.status(200).json("Room has been deleted");
  }catch(err){
    next(err);
  }
}

export const getRoom = async (req, res, next) => {
  try{
    const room = await Room.findById(
      req.params.id
    );
    res.status(200).json(room);
  } catch(err){
      next(err);
  }
}

export const getRooms = async (req, res, next) => {
  // here is where we put our code after callback function in index.js, Then add next callback function above
  // console.log("Hi I'm a hotel route")

  // Create a bundle operation
  // const failed = true;
  
  // if (failed) return next(createError(401, "You are not authenticated!"));

  // next()
  // next will throw an error because it's not returned. To fix that, we'll use a return statement. 
  // return next()

  try{
    const rooms = await Room.find();
    // const hotels = await Hotel.findById(
    //   // req.params.id
    //   "unknown id"
    // );
    res.status(200).json(rooms);
  } catch(err){
      // res.status(500).json(err);
      next(err)
  }
}
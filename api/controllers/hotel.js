import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try{
    const savedHotel = await newHotel.save()
    // res.status(200) shows that the request is successful
    res.status(200).json(savedHotel) 
  }catch(err){
    next(err);
  }
}

export const updateHotel = async (req, res, next) => {
  try{
    // After finding our hotel using this code
    // Note: findByIdAndUpdate will only return to previous document and not to update. To prevent this, we will add the {new: true} method
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      // we will update it with mongodb set method
      { $set: req.body},
      // below code will allow the input update both in api request and database
      { new: true }
      );
      // if it's sucessful, we're going to return this code
    res.status(200).json(updatedHotel);
  }catch(err){
    next(err);
  }
}

export const deleteHotel = async (req, res, next) => {
  try{
    // It's not going to return anything because we're deleting
    await Hotel.findByIdAndDelete(
      req.params.id
    );
    res.status(200).json("Hotel has been deleted");
  }catch(err){
    next(err);
  }
}

export const getHotel = async (req, res, next) => {
  try{
    const hotel = await Hotel.findById(
      req.params.id
    );
    res.status(200).json(hotel);
  } catch(err){
      next(err);
  }
}

export const getHotels = async (req, res, next) => {
  // here is where we put our code after callback function in index.js, Then add next callback function above
  // console.log("Hi I'm a hotel route")
  
  // Create a bundle operation
  // const failed = true;
  
  // if (failed) return next(createError(401, "You are not authenticated!"));

  // next()
  // next will throw an error because it's not returned. To fix that, we'll use a return statement. 
  // return next()

  // first try
  // try {
  //   const hotels = await Hotel.find();
  //   res.status(200).json(hotels);
  // } catch (err) {
  //   next (err);
  // }
  
  // third try from online
  // try{
    //   const { featured, limit } = req.query;
    //   const parsedLimit = parseInt(limit);
    //   const hotels = await Hotel.find({ featured: featured === 'true' }).limit(parsedLimit);
    //   res.status(200).json(hotels);
    // } catch(err){
      //     // res.status(500).json(err);
      //     next(err)
  // }

  // second try
  // try{
  //   // To take the price maximum and minimum
  //   const { min, max, limit, ...others } = req.query;
  //   const parsedLimit = parseInt(limit);
  //   const hotels = await Hotel.find({
  //     ...others,
  //     cheapestPrice: { $gt: min || 1, $lt: max },
  //   }).limit(parsedLimit);
  //   res.status(200).json(hotels);
  // } catch(err){
  //     // res.status(500).json(err);
  //     next(err)
  // }
  const { min, max, ...others } = req.query;
  try {
    const hotels = await Hotel.find({
      ...others,
      cheapestPrice: {
        $gt: 1, $lt: 999
      },
    }).limit(req.query.limit);
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
}

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",")
  try{
    const list = await Promise.all(cities.map(city => {
      // we could use return Hotel.find({city:cities}).length but it's going to fetch all data & properties before its length
      // return Hotel.find({city:cities}).length
      return Hotel.countDocuments({city: city})
    }))
    res.status(200).json(list);
  } catch(err){
      next(err)
  }
}

export const countByType = async (req, res, next) => {
  // You can still use below code for infinite Hotels like cities, but we'll write it separately since it's just 5
  // const cities = req.query.cities.split(",")
  try{
    const hotelCount =  await Hotel.countDocuments({ type: "hotel" })
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" })
    const resortCount = await Hotel.countDocuments({ type: "resort" })
    const villaCount = await Hotel.countDocuments({ type: "villa" })
    const cabinCount = await Hotel.countDocuments({ type: "cabin" })
    
    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch(err){
      next(err)
  }
}

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room)
      })
    );
    res.status(200).json(list)
  } catch(err) {
    next(err)
  }
};
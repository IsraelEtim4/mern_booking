import User from "../models/User.js";

export const createUser = async (req, res, next) => {
  const newUser = new User(req.body);

  try{
    const savedUser = await newUser.save()
    // res.status(200) shows that the request is successful
    res.status(200).json(savedUser)
  }catch(err){
    next(err);
  }
}

export const updateUser = async (req, res, next) => {
  try{
    // After finding our hotel using this code
    // Note: findByIdAndUpdate will only return to previous document and not to update. To prevent this, we will add the {new: true} method
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      // we will update it with mongodb set method
      { $set: req.body},
      // below code will allow the input update both in api request and database
      { new: true }
      );
      // if it's sucessful, we're going to return this code
    res.status(200).json(updatedUser);
  }catch(err){
    next(err);
  }
}

export const deleteUser = async (req, res, next) => {
  try{
    // It's not going to return anything because we're deleting
    await User.findByIdAndDelete(
      req.params.id
    );
    res.status(200).json("User has been deleted");
  }catch(err){
    next(err);
  }
}

export const getUser = async (req, res, next) => {
  try{
    const user = await User.findById(
      req.params.id
    );
    res.status(200).json(user);
  } catch(err){
      next(err);
  }
}

export const getUsers = async (req, res, next) => {
  // here is where we put our code after callback function in index.js, Then add next callback function above
  // console.log("Hi I'm a hotel route")

  // Create a bundle operation
  // const failed = true;
  
  // if (failed) return next(createError(401, "You are not authenticated!"));

  // next()
  // next will throw an error because it's not returned. To fix that, we'll use a return statement. 
  // return next()

  try{
    const users = await User.find();
    // const hotels = await Hotel.findById(
    //   // req.params.id
    //   "unknown id"
    // );
    res.status(200).json(users);
  } catch(err){
      // res.status(500).json(err);
      next(err)
  }
}
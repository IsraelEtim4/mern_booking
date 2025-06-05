import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors"

import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import roomsRoute from "./routes/rooms.js";
import hotelsRoute from "./routes/hotels.js";

// dotenv.config() is used to connect to mongoDB
const app = express();
dotenv.config();

const connect = async ()=> {
  // this code is gotten from mongoose site
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", ()=>{
  console.log("mongoDB disconnected!")
})

mongoose.connection.on("connected", ()=>{
  console.log("mongoDB connected!")
})

// req = request while res = response
app.get("/", (req,res)=>{
  res.send("hello first request!")
})

// middlewares
// Because you cannot send your json like that to express, you have to use the code below
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

// How to handle Errors in express server. 

// First, we need to understand express middlewares. Why are they very important? It's because express is able to reach our request and response before sending anything to users
// use, we can reach request and response, and we're going too use next callback function. Afterwhich, we get to hotels
app.use(( err, req, res, next ) => {
  // console.log("Hi I'm a middleware")
  // res.send("Hello from Middleware")

  // We constumize our error instead of just sending error 500 by sending specific error
  const errorStatus = err.status || 500
  const errorMessage = err.message || "Something went wrong!"

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  })
})


app.listen(8800, () => {
  connect()
  console.log("Connected to backend.");
});
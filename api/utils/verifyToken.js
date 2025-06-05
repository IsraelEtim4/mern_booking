import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  // To take our token from cookies
  const token = req.cookies.access_token;

  // If token
  if (!token) {
    return next(createError(401, "You are not authenticated!"))
  }

  // If there is a token, we should also verify it
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      return next(createError(403, "Token is not valid!"));
    }
    // If no error and everything is ok, you can assign anything, like; req.hello
    req.user = user;
    next()
  });
};

// 
export const verifyUser = (req, res, next) => {
  // To verify our user
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next()
    } else {
      if (err) {
        return next(createError(403, "You are not authorized!"));
      }
    }
  })
}

// 
export const verifyAdmin = (req, res, next) => {
  // To verify our user
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next()
    } else {
      if (err) {
        return next(createError(403, "You are not authorized!"));
      }
    }
  })
}
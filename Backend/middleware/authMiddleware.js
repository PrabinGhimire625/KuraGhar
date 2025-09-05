import User from "../model/userModel.js"
import jwt from "jsonwebtoken"

// Role define
export const Role = {
    Admin: "admin",
    Artist: "artist",
    User: "user"
  };
  
//to verify the user from the token
// verify user from token
export const isAuthenticated = async (req, res, next) => {
  //const token =
   // req.cookies?.token || req.headers.authorization?.split(" ")[1]; // check cookie first
const token=req.headers.authorization
  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  jwt.verify(token, process.env.JWT_SECRETE, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    try {
      const userData = await User.findById(decoded.id);
      if (!userData) {
        return res.status(404).json({ message: "No user with that token" });
      }

      req.user = userData; // attach userData to req.user
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
};

//restrction based on the user/admin
export const restrictTo = (...roles) => {
    return (req, res, next) => {
      const userRole = req.user.role;
      if (!roles.includes(userRole)) {
        return res.status(403).json({
          message: "You don't have permission"
        });
      } else {
        next();
      }
    };
  };
  
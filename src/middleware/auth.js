import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
// import jwt from "jsonwebtoken";
// const User = require("../models/User");

// // Verify JWT token
// const auth = async (req, res, next) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "No token provided, authorization denied" });
//     }

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET || "your-secret-key"
//     );
//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       return res.status(401).json({ message: "Token is not valid" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };

// // Check if user is manager
// const isManager = (req, res, next) => {
//   if (req.user.role !== "manager") {
//     return res
//       .status(403)
//       .json({ message: "Access denied. Manager role required." });
//   }
//   next();
// };

// // Check if user is engineer or accessing own data
// const isEngineerOrOwn = (req, res, next) => {
//   if (req.user.role === "manager") {
//     return next(); // Managers can access all data
//   }

//   if (req.user.role === "engineer") {
//     // Engineers can only access their own data
//     const userId = req.params.id || req.body.engineerId;
//     if (userId && userId !== req.user._id.toString()) {
//       return res
//         .status(403)
//         .json({ message: "Access denied. You can only access your own data." });
//     }
//   }

//   next();
// };

// module.exports = { auth, isManager, isEngineerOrOwn };

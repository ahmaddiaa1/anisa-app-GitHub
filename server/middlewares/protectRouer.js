import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const protectRouter = async (req, res, next) => {
  let token;
  if (req.cookies) {
    token = req.cookies.token;
  }
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (req.headers.cookie) {
    token = req.headers.cookie.split("token=")[1];
  }

  if (!token) {
    return res.status(401).json({
      msg: "Unauthorized",
      statusCode: 401,
      statusText: "FAIL",
      error: "no token",
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return res.status(401).json({
        msg: "Unauthorized",
        statusCode: 401,
        statusText: "FAIL",
        error: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error in protect route",
      statusCode: 401,
      statusText: "FAIL",
      error: error.message,
    });
  }
  return token;
};

export default protectRouter;

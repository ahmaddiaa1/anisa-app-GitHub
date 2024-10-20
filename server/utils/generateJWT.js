import jwt  from "jsonwebtoken";
const GenerateToken = (res, userId) => {
  try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    if (!token) {
      return res.status(400).json({
        msg: "Invalid token",
        statusCode: 400,
        statusText: "FAIL",
      });
    }

    res.cookie("token", token, {
      secure: false, // Ensures the cookie is sent only over HTTPS
      httpOnly: false, // Prevents JavaScript access to the cookie
      sameSite: "lax", // Controls cross-site request behavior ("strict" for higher security)
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
      path: "/", // Cookie is available across the entire domain
    });
  } catch (error) {
    res.status(400).json({
      msg: "Invalid token",
      statusCode: 400,
      statusText: "FAIL",
      error,
    });
  }
};

export default GenerateToken;

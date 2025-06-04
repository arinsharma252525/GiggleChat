import jwt from "jsonwebtoken";

const authenticated = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "Credentials not found" });
    }

    let verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(verifyToken);
    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error in authentication middleware ${error}` });
  }
};

export default authenticated;

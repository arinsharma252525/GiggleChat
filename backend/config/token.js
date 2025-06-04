import jwt from "jsonwebtoken";

const genToken = async (id) => {
  try {
    const token = await jwt.sign({ userId: id }, process.env.JWT_SECRET, {
      expiresIn: "14d",
    });
    return token;
  } catch (error) {
    console.log("An error occured while generating token");
  }
};

export default genToken;

import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

//Signup
export const signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const userExist = await User.findOne({ userName });
    if (userExist) {
      return res.status(400).json({ message: "User already exists!" });
    }

    if(!userName || !email || !password){
      return res.status(400).json({ message: "Something looks missing!" });
    }

    const emailRegistered = await User.findOne({ email });
    if (emailRegistered) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password length must be atleast 8 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Internal server error ${error}` });
  }
};

//Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Internal server error ${error}` });
  }
};

//Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    return res.status(500).json({ message: `Internal server error ${error}` });
  }
};

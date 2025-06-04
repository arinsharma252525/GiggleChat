import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

//Loggedin user
export const loggedUser = async (req, res) => {
  try {
    let userId = req.userId;
    let user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Internal server error ${error}` });
  }
};

//Edit Profile
export const editProfile = async (req, res) => {
  try {
    let { name } = req.body;
    let image;
    if (req.file) {
    image = await uploadOnCloudinary(req.file.path);
    if (!image) {
    return res.status(500).json({ message: "Image upload failed" });
  }
}

    let updateData = { name };
    if (image) updateData.image = image;

    let user = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
    });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    console.log(user);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Internal server error ${error}` });
  }
};

//Find Users
export const findUsers = async (req, res) => {
  try {
    let users = await User.find({
      _id: { $ne: req.userId },
    }).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: `Internal server error ${error}` });
  }
};

//Search User
export const search = async (req, res) => {
  try {
    let { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Type something" });
    }

    let users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
      ],
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: `Internal server error ${error}` });
  }
};

import express from "express";
import { editProfile, findUsers, loggedUser, search } from "../controllers/user.controller.js";
import authenticated from "../middleware/authenticated.js";
import { upload } from "../middleware/multer.js";


const userRoute = express.Router();

userRoute.get("/loggeduser",authenticated, loggedUser);
userRoute.get("/users",authenticated, findUsers);
userRoute.put("/profile",authenticated, upload.single("image"), editProfile);
userRoute.get("/search",authenticated, search);

export default userRoute;

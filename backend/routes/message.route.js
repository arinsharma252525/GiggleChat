import express from "express";
import authenticated from "../middleware/authenticated.js";
import { upload } from "../middleware/multer.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";


const messageRoute = express.Router();

messageRoute.post("/send/:receiver", authenticated, upload.single("image"), sendMessage)
messageRoute.get("/get/:receiver", authenticated,  getMessage)

export default messageRoute;

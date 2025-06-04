import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
dotenv.config();
import cors from "cors";
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";

const port = process.env.PORT || 404;

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}));
app.use(express.json());
app.use('/public', express.static('public'));
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

server.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
  connectDB();
});

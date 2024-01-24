const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();
PORT = process.env.PORT || 6010;
app.use(express.json());
app.use(cors());
app.use(cookieParser());
const fileupload = require("express-fileupload");
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

const cloudinary = require("./config/cloudinary");
const dbConnect = require("./config/database");
cloudinary.cloudinaryConnect();
dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Connection with server was successful", { PORT });
    });
  })
  .catch((err) => {
    console.log("connection with the server was not established", err);
  });
const authRoutes = require("./routes/path");
app.use("/cac/v1", authRoutes);

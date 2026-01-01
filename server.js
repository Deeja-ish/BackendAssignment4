require('dotenv').config();
const express = require('express');
const morgan = require("morgan");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000
const cors = require("cors")
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes")
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

connectDB();

app.use("/api/post", postRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log("Server is running on port", port);
});


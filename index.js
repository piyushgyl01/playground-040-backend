require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { corsOptions } = require("./config/corsOptions");
const PORT = process.env.PORT || 4000;

const { connectToDB } = require("./config/db.connect");

console.log(process.env.NODE_ENV);
connectToDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//auth
app.use("/api/v1/auth", require("./routes/authRoute"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET_TOKEN = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

function generateTokens(user) {
  const payload = {
    id: user._id,
    username: user.username || user.email,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET_TOKEN, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
}

module.exports = { generateTokens };

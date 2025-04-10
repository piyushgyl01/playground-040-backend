const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET_TOKEN = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res
      .status(403)
      .json({ message: "You need to sign in before continuing." });
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET_TOKEN);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid Token", error: error.message });
  }
}

module.exports = { authenticateToken };

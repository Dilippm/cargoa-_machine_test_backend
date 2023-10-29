const jwt = require("jsonwebtoken");

const KEY = process.env.SECRET_KEY;

function requireAuth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "User token not found." });
  }

  try {
    const decodedToken = jwt.verify(token.split(" ")[1], `${KEY}`);

    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "User token expired." });
    }

    return res.status(400).json({ message: error.message });
  }
}

module.exports = requireAuth;

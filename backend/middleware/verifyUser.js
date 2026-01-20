const { auth } = require("../config/firebase");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = await auth.verifyIdToken(token);

    // 🔥 NEW: re-check email verification from Admin SDK
    const user = await auth.getUser(decoded.uid);

    if (!user.emailVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

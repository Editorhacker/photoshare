const { auth, db } = require("../config/firebase");

exports.signup = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Get real UID from Firebase (safer)
    const user = await auth.getUserByEmail(email);

    await db.collection("photographers").doc(user.uid).set({
      name,
      email,
      role: "photographer",
      googleDriveConnected: false,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Profile created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await auth.getUserByEmail(email);

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email before login",
      });
    }

    res.json({
      message: "Login allowed",
      uid: user.uid,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

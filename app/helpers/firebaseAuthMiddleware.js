import admin from "../../firebaseAdmin.js"; // Firebase Admin SDK importé

const firebaseAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Autorisation manquante" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Token manquant, merci de vous reconnecter" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
};

export default firebaseAuthMiddleware;

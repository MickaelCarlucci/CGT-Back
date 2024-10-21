import admin from '../../firebaseAdmin.js'; // Firebase Admin SDK importé

const firebaseAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: "Autorisation manquante" });
  }

  // Récupérer le token après "Bearer"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Token manquant, merci de vous reconnecter" });
  }

  try {
    // Vérification du token Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Si tout va bien, on ajoute les informations utilisateur décodées dans req.user
    req.user = decodedToken;
    
    // Passer à la prochaine middleware ou route
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
};

export default firebaseAuthMiddleware;

import jwt from "jsonwebtoken";

const JWTSecret = process.env.JWT_SECRET;

const jwtExpirationVerification = (request, response, next) => {
  const authHeader = request.headers['authorization'];

  if (!authHeader) {
    return response.status(401).json({ error: "Autorisation manquante" });
  }

  // Vérifiez que l'en-tête utilise le schéma "Bearer"
  const token = authHeader.split(' ')[1]; // Récupérer le token après "Bearer"

  if (!token) {
    return response.status(401).json({ error: "Token manquant, merci de vous reconnecter" });
  }

  // Vérification du token d'accès
  jwt.verify(token, JWTSecret, (error, decoded) => {
    if (error) {
      return response.status(401).json({ error: "Token expiré ou invalide" });
    }

    // Le token est valide, on ajoute l'utilisateur décodé à la requête
    request.user = decoded;

    // Passer au middleware suivant
    next();
  });
};

export default jwtExpirationVerification;

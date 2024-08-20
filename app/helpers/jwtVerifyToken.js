const JWTSecret = process.env.JWT_SECRET;
import jwt from "jsonwebtoken";

const jwtExpirationVerification = async (request, response, next) => {
    // Récupérer le token depuis le header Authorization
    const authHeader = request.headers['authorization'];
  
    if (!authHeader) {
      return response.status(401).json({ error: "Autorisation manquante" });
    }
  
    // Le token est sous la forme "Bearer <token>"
    const token = authHeader.split(' ')[1];
  
    if (!token) {
      return response.status(401).json({ error: "Token manquant" });
    }
  
    // Vérifier le token JWT
    jwt.verify(token, JWTSecret, (error, user) => {
      if (error) {
        return response.status(401).json({ error: "Token expiré" });
      }

      request.user = user;
      next();
    });
  };

  export default jwtExpirationVerification;
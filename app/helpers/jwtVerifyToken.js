import jwt from "jsonwebtoken";

const JWTSecret = process.env.JWT_SECRET;

const jwtExpirationVerification = (request, response, next) => {
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
        return response.status(401).json({ error: "Autorisation manquante" });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return response.status(401).json({ error: "Token manquant" });
    }

    jwt.verify(token, JWTSecret, (error, user) => {
        if (error) {
            if (error.name === 'TokenExpiredError') {
                return response.status(401).json({ error: "Token expiré" });
            } else {
                return response.status(401).json({ error: "Token invalide" });
            }
        }

        // Ajoute l'utilisateur à la requête pour l'accès dans les routes
        request.user = user;
        next();
    });
};

export default jwtExpirationVerification;

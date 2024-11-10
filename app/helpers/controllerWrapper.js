export default (controllerMdw) => async (request, response, next) => {
  try {
    await controllerMdw(request, response, next);
  } catch (err) {
    console.error("Error caught:", err);
    const error = new Error(err.message);

    // Gestion spécifique des erreurs en fonction des statuts
    if (err.status) {
      error.httpStatus = err.status; // Utilise le code d'erreur retourné par l'API Mailgun
    } else {
      error.httpStatus = 500; // Code par défaut
    }

    next(error);
  }
};

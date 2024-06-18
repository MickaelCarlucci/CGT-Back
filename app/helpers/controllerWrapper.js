export default (controllerMdw) => async (request, response, next) => {
    try {
      await controllerMdw(request, response, next);
    } catch (err) {
      const error = new Error(err.message);
      error.httpStatus = 500;
      next(error);
    }
  };
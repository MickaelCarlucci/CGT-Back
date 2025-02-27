export default (controllerMdw) => async (request, response, next) => {
  try {
    await controllerMdw(request, response, next);
  } catch (err) {
    console.error("Error caught:", err);
    const error = new Error(err.message);

    if (err.status) {
      error.httpStatus = err.status;
    } else {
      error.httpStatus = 500;
    }

    next(error);
  }
};

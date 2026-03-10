// ================================= Not Found Handler ===================================
export const notFoundHandler = (req, res, next) => {
  return next(new Error(`Route ${req.originalUrl} not found`, { cause: 404 }))
}

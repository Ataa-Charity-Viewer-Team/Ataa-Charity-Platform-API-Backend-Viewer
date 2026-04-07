// ================================= Not Found Handler ===================================
export const notFoundHandler = (req, res, next) => {
  return next(new Error(`Route ${req.originalUrl} not found in this server `, { cause: 404 }))
}

const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", {
    message: err.message,
    details: err.details, // ← CLAVE
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    body: req.body,
  });

  res.status(err.statusCode || 500).json({
    ok: false,
    message: err.message,
    details: err.details || null, // opcional exponer en dev
  });
};

module.exports = errorHandler;
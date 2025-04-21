// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);
  
    // Handle Prisma database connection errors
    if (err.code === "P1001" || err.message.includes("ECONNREFUSED") || err.message.includes("ETIMEOUT")) {
      return res.status(503).json({
        success: false,
        message: "Service Unavailable. The database connection failed.",
      });
    }
  
    // Default 500 error for other cases
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  };
  
  export default errorHandler;
  
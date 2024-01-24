const jwt = require("jsonwebtoken");
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.error("Token verification failed:", err);
        res.status(401).json({
          success: false,
          message: "Unauthorized. Token verification failed.",
        });
      } else {
        console.log("Decoded Token:", decodedToken);
        if (req.path === "/login") {
          res.status(200).json({
            success: true,
            message: "User is authenticated. Redirect to /admin.",
          });
        } else {
          req.user = decodedToken;
          console.log("User role:", decodedToken.role);
          next();
        }
      }
    });
  } else {
    console.error("No token found.");
    res.status(401).json({
      success: false,
      message: "Unauthorized. No token found.",
    });
  }
};
module.exports = { requireAuth };

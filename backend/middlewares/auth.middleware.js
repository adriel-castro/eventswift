const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.user.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({
        status: false,
        data: [],
        error: { message: "Not authorized!" },
      });
    }
  }
  if (!token) {
    res.status(401).json({
      status: false,
      data: [],
      error: { message: "Not authorized, no token" },
    });
  }
};

module.exports = {
  auth,
};

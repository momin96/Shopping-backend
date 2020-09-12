const { validationResult, check } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const User = require("../models/user");
const { use } = require("../routes/auth");

exports.signup = (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors.array(),
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save in DB",
      });
    }
    return res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
  }

  User.findOne({ email }, (err, user) => {
    // Check for user exist of not
    if (!user) {
      return res.status(401).json({
        error: "User email does not exist",
      });
    }

    // User email exist check for password
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email & Password did not match",
      });
    }

    // Create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    // Put toke in Cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    // send response to front end
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User Signout",
  });
};

// Protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

// Custom Middleware
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role == 0) {
    return res.status(403).json({
      error: "Access Denied",
    });
  }
  next();
};

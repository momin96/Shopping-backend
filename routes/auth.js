var express = require("express");
var router = express.Router();
const { check } = require("express-validator");

const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.get("/signout", signout);

router.post(
  "/signup",
  [
    check("name", "Name should be minimum 3 char").isLength({ min: 3 }),
    check("email", "Invalid Email").isEmail(),
    check("password", "Password should be minimum 3 char").isLength({ min: 3 }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Invalid email"),
    check("password").isLength({ min: 1 }).withMessage("Password required"),
  ],
  signin
);

router.get("/testroute", isSignedIn, (req, res) => {
  res.json(req.auth);
});

module.exports = router;

const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User did not found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized",
        });
      }

      user.salt = undefined;
      user.encry_password = undefined;
      req.profile.createdAt = undefined;
      req.profile.updatedAt = undefined;
      return res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id email name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No Order in Account",
        });
      }

      return res.json(order);
    });
};

// Middleware
exports.pushOrdersInPurchaseList = (req, res, next) => {
  let purchases = [];

  req.body.order.products.array.forEach((product) => {
    // TODO: Need to test properly
    const { _id, name, description, category, quantity } = product;
    const { amount, transaction_id } = req.body.order;
    purchases.push({
      /* _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
      */
      _id,
      name,
      description,
      category,
      quantity,
      amount,
      transaction_id,
    });
  });

  // Store in DB

  User.findOneAndUpdate(
    {
      _id: req.profile._id,
    },
    {
      $push: { purchases: purchases },
    },
    {
      new: true,
    },
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save purchase list",
        });
      }
      next();
    }
  );
};

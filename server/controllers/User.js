import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createError } from "../error.js";
import User from "../models/User.js";
import Orders from "../models/Orders.js";

dotenv.config();

// Auth

export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;

    //Check for existing user
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      img,
    });
    const createdUser = await user.save();
    const token = jwt.sign(
      { id: createdUser._id, role: createdUser.role },
      process.env.JWT,
      {
        expiresIn: "9999 years",
      }
    );
    return res.status(201).json({ token, user: createdUser });
  } catch (err) {
    next(err);
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Check for existing user
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      return next(createError(409, "This Account Does not exist"));
    }

    const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    return res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
};

//Cart

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const existingCartItemIndex = user.cart.findIndex((item) =>
      item.product.equals(productId)
    );
    if (existingCartItemIndex !== -1) {
      // Product is already in the cart, update the quantity
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      // Product is not in the cart, add it
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    return res
      .status(200)
      .json({ message: "Product added to cart successfully", user });
  } catch (err) {
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const productIndex = user.cart.findIndex((item) =>
      item.product.equals(productId)
    );
    if (productIndex !== -1) {
      if (quantity && quantity > 0) {
        user.cart[productIndex].quantity -= quantity;
        if (user.cart[productIndex].quantity <= 0) {
          user.cart.splice(productIndex, 1); // Remove the product from the cart
        }
      } else {
        user.cart.splice(productIndex, 1);
      }

      await user.save();

      return res
        .status(200)
        .json({ message: "Product quantity updated in cart", user });
    } else {
      return next(createError(404, "Product not found in the user's cart"));
    }
  } catch (err) {
    next(err);
  }
};

export const getAllCartItems = async (req, res, next) => {
  try {
    const userJWT = req.user;
    const user = await User.findById(userJWT.id).populate({
      path: "cart.product",
      model: "Food",
    });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const cartItems = user.cart;
    return res.status(200).json(cartItems);
  } catch (err) {
    next(err);
  }
};

//Orders

export const placeOrder = async (req, res, next) => {
  try {
    const { products, address, totalAmount } = req.body;
    const userJWT = req.user;
    console.log("placeOrder: userJWT", userJWT);
    const user = await User.findById(userJWT.id);
    if (!user) {
      console.log("placeOrder: User not found", userJWT.id);
      return next(createError(404, "User not found"));
    }

    const order = new Orders({
      products: products.map((item) => ({
        product: item.product._id || item.product,
        quantity: item.quantity,
      })),
      user: new mongoose.Types.ObjectId(user._id), // Explicitly cast to ObjectId
      total_amount: totalAmount,
      address,
    });

    const savedOrder = await order.save();
    console.log("placeOrder: Order saved successfully with ID:", savedOrder._id);

    // Populate the order details before returning to frontend
    const populatedOrder = await Orders.findById(savedOrder._id).populate("products.product");

    // Ensure the order is linked to the user and clear cart
    user.orders.push(savedOrder._id);
    user.cart = [];
    await user.save();
    console.log("placeOrder: User document updated (orders array and cart cleared)");

    return res
      .status(201)
      .json({ message: "Order placed successfully", order: populatedOrder });
  } catch (err) {
    console.error("placeOrder detailed error:", err);
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const userJWT = req.user;
    console.log("getAllOrders: Request from user ID:", userJWT.id);

    if (!mongoose.Types.ObjectId.isValid(userJWT.id)) {
      console.error("getAllOrders: Invalid user ID format in JWT:", userJWT.id);
      return next(createError(400, "Invalid user ID"));
    }

    const userId = new mongoose.Types.ObjectId(userJWT.id);

    // Try finding by user field (both ObjectId and string as fallback)
    let orders = await Orders.find({
      $or: [
        { user: userId },
        { user: userJWT.id }
      ]
    })
      .populate("products.product")
      .sort({ createdAt: -1 })
      .exec();

    console.log(`getAllOrders: Found ${orders.length} orders by direct 'user' query for ${userId}`);

    // If still empty, try finding the user first and returning their orders array
    if (orders.length === 0) {
      console.log(`getAllOrders: No orders found by user field, checking user's orders array for ${userId}`);
      const userDoc = await User.findById(userId).populate({
        path: "orders",
        populate: { path: "products.product" },
      });

      if (userDoc && userDoc.orders && userDoc.orders.length > 0) {
        console.log(`getAllOrders: Found ${userDoc.orders.length} orders via user.orders array`);
        orders = userDoc.orders;
      }
    }

    return res.status(200).json({ orders });
  } catch (err) {
    console.error("getAllOrders detailed error:", err);
    next(err);
  }
};

export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Orders.find()
      .populate("user", "name email")
      .populate("products.product")
      .sort({ createdAt: -1 })
      .exec();
    return res.status(200).json({ orders });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      return next(createError(404, "Order not found"));
    }
    return res.status(200).json({ message: "Order status updated", updatedOrder });
  } catch (err) {
    next(err);
  }
};

//Favorites

export const removeFromFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    user.favourites = user.favourites.filter((fav) => !fav.equals(productId));
    await user.save();

    return res
      .status(200)
      .json({ message: "Product removed from favorites successfully", user });
  } catch (err) {
    next(err);
  }
};

export const addToFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    if (!user.favourites.some((fav) => fav.equals(productId))) {
      user.favourites.push(productId);
      await user.save();
    }

    return res
      .status(200)
      .json({ message: "Product added to favorites successfully", user });
  } catch (err) {
    next(err);
  }
};

export const getUserFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("favourites").exec();
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const favoriteProducts = user.favourites;
    return res.status(200).json(favoriteProducts);
  } catch (err) {
    next(err);
  }
};

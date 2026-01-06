import mongoose from "mongoose";
import Food from "../models/Food.js";
import { createError } from "../error.js";

export const addProducts = async (req, res, next) => {
  try {
    const foodData = req.body;
    if (!Array.isArray(foodData)) {
      return next(
        createError(400, "Invalid request. Expected an array of foods.")
      );
    }
    let createdfoods = [];
    for (const foodInfo of foodData) {
      const { name, desc, img, price, ingredients, category } = foodInfo;
      const product = new Food({
        name,
        desc,
        img,
        price,
        ingredients,
        category,
      });
      const createdFoods = await product.save();
      createdfoods.push(createdFoods);
    }
    return res
      .status(201)
      .json({ message: "Products added successfully", createdfoods });
  } catch (err) {
    next(err);
  }
};

export const getFoodItems = async (req, res, next) => {
  try {
    let { categories, minPrice, maxPrice, ingredients, search } = req.query;
    ingredients = ingredients?.split(",");
    categories = categories?.split(",");

    const filter = {};
    if (categories && Array.isArray(categories) && categories[0] !== "undefined") {
      filter.category = { $in: categories };
    }
    if (ingredients && Array.isArray(ingredients) && ingredients[0] !== "undefined") {
      filter.ingredients = { $in: ingredients };
    }
    if (maxPrice && maxPrice !== "undefined" || minPrice && minPrice !== "undefined") {
      filter["price.org"] = {};
      if (minPrice && minPrice !== "undefined") {
        const min = parseFloat(minPrice);
        if (!isNaN(min)) filter["price.org"]["$gte"] = min;
      }
      if (maxPrice && maxPrice !== "undefined") {
        const max = parseFloat(maxPrice);
        if (!isNaN(max)) filter["price.org"]["$lte"] = max;
      }
      if (Object.keys(filter["price.org"]).length === 0) delete filter["price.org"];
    }
    if (search && search !== "undefined") {
      filter.$or = [
        { name: { $regex: new RegExp(search, "i") } }, // Case-insensitive name search
        { desc: { $regex: new RegExp(search, "i") } }, // Case-insensitive description search
      ];
    }
    const foodList = await Food.find(filter);

    return res.status(200).json(foodList);
  } catch (err) {
    next(err);
  }
};

export const getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return next(createError(400, "Invalid product ID"));
    }
    const food = await Food.findById(id);
    if (!food) {
      return next(createError(404, "Food not found"));
    }
    return res.status(200).json(food);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return next(createError(400, "Invalid product ID"));
    }
    const updatedFood = await Food.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedFood) {
      return next(createError(404, "Food not found"));
    }
    return res.status(200).json({ message: "Product updated successfully", updatedFood });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return next(createError(400, "Invalid product ID"));
    }
    const food = await Food.findByIdAndDelete(id);
    if (!food) {
      return next(createError(404, "Food not found"));
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};

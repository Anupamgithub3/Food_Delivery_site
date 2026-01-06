import express from "express";
import {
    addProducts,
    deleteProduct,
    getFoodById,
    getFoodItems,
    updateProduct,
} from "../controllers/Food.js";
import { verifyToken } from "../middleware/verifyUser.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post("/add", verifyToken, verifyAdmin, addProducts);
router.get("/", getFoodItems);
router.get("/:id", getFoodById);
router.patch("/:id", verifyToken, verifyAdmin, updateProduct);
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);

export default router;

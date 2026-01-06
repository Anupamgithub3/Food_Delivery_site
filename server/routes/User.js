import {
  UserLogin,
  UserRegister,
  addToCart,
  addToFavorites,
  getAdminOrders,
  getAllCartItems,
  getAllOrders,
  getUserFavorites,
  placeOrder,
  removeFromCart,
  removeFromFavorites,
  updateOrderStatus,
} from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyUser.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post("/signup", UserRegister);
router.post("/signin", UserLogin);

router.post("/cart", verifyToken, addToCart);
router.get("/cart", verifyToken, getAllCartItems);
router.patch("/cart", verifyToken, removeFromCart);

router.post("/favorite", verifyToken, addToFavorites);
router.get("/favorite", verifyToken, getUserFavorites);
router.patch("/favorite", verifyToken, removeFromFavorites);

router.post("/order", verifyToken, placeOrder);
router.get("/order", verifyToken, getAllOrders);

// Admin routes for orders
router.get("/admin/orders", verifyToken, verifyAdmin, getAdminOrders);
router.patch("/admin/order/:orderId", verifyToken, verifyAdmin, updateOrderStatus);

export default router;

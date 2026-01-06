import { createError } from "../error.js";

export const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return next(createError(403, "You are not authorized to access this resource! Admin only."));
    }
};

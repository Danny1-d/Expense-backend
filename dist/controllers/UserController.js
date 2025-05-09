var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import db from "../db/index.js";
export const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body; // Extract userId from request body
        const result = yield db.query("SELECT * FROM users WHERE id = $1", [userId]); // Query to get user by ID
        const user = result.rows[0]; // Get the first user from the result
        if (!result.rows.length) {
            res.status(404).json({ message: "User not found" }); // If no user found, return 404
        }
        res.status(200).json({
            name: user.name,
            isAccountVerified: user.isAccountVerified,
        }); // Return the user data
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

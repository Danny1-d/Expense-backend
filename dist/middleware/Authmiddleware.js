import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
export const AuthMiddleware = (req, res, next) => {
    var _a;
    // const { token } = req.cookies; // Extract token from cookies
    const token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]); // Check both cookie and authorization header
    if (!token) {
        res.status(401).json({ message: "Unauthorized. Login again" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key
        console.log("Decoded token:", decoded);
        // if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
        //   const userId = (decoded as JwtPayload).id;
        //   req.body.userId = userId;  // Set the user ID on the request body
        //   next();  // Proceed to the next middleware
        // } else {
        //   console.log("Decoded token is missing the id");
        //   res.status(401).json({ message: "Not Authorized. Login again" });
        // }
        // Check if the decoded token contains the user ID
        if (typeof decoded === "object" && "id" in decoded) {
            req.body.userId = decoded.id; // Attach user ID to the request body
        }
        else {
            res.status(401).json({ message: "Not Authorized. Login again" });
        }
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        console.error("Token verification error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

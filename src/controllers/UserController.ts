import db from "../db/index.ts";
import type { Request, Response } from "express";

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body; // Extract userId from request body
    const result = await db.query("SELECT * FROM users WHERE id = $1", [userId]); // Query to get user by ID
    const user = result.rows[0]; // Get the first user from the result

    if (!result.rows.length) {
      res.status(404).json({ message: "User not found" }); // If no user found, return 404
    }

    res.status(200).json(
      {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      }
    ); // Return the user data

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
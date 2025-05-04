import express from "express";
const router = express.Router();
import db from "../db/index.ts";
import bcrypt from "bcrypt";

router.post ("/", async (req, res) => {
  const { email, password } = req.body;
  console.log(email)
  console.log(password)

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length > 0) {
      console.log(result.rows)
      const user = result.rows[0];
      const storedPassword = user.password;

      bcrypt.compare(password, storedPassword, async (err, result) => {
        if (err) {
          console.log("Error comparing password:", err)
        } else {
          if (result) {
            res.send("success")
            console.log("success")
          } else {
            res.send("Incorrect Password")
            console.log("Incorrect Password")
          }
        }
      })
    } else {
      res.send("User not found")
      console.log("User not found")
    }
  } catch (err) {
    console.log(err)
  }
  // res.send({success: true, message: "Login successful"})
})

export default router;
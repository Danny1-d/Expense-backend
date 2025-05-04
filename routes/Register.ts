import express from "express";
const router = express.Router();
import db from "../db/index.ts";
import bcrypt from "bcrypt";

const saltRounds = 10;

router.post ("/", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  console.log(first_name)
  console.log(last_name)
  console.log(email)
  console.log(password)

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.")
    } else {
      //password hashing
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log("Error hashing password:", err)
        } else {
          const result = await db.query("INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)", [first_name, last_name, email, hash]);
          console.log(result)
          res.send("Login successful")
        }
      })
    }
  } catch (err) {
    console.log(err)
  }
})

// router.post ("/auth/signin", (req, res) => {
//   const { email, password } = req.body;
//   console.log(email)
//   console.log(password)
//   res.send({success: true, message: "Login successful"})
// })

// router.post ("/auth/ForgotPassword", (req, res) => {
//   const { password } = req.body;
//   console.log(password)
//   res.send({success: true, message: "Login successful"})
// })

export default router
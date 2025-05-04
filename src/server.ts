import express from "express"
import bodyParser from "body-parser";
import cors from "cors"
import register from "../routes/Register.ts"
import login from "../routes/Login.ts"
const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.get ("/", (req, res) => {
  res.send("Hello World")
})

app.use("/auth/signup", register)
app.use("/auth/signin", login)


app.listen(port, () => {
  console.log(`Runinng on port ${port}`);
})
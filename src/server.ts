import express from "express"
import bodyParser from "body-parser";
import cors from "cors"
import cookieParser from "cookie-parser"
import router from "./routes/AuthRoutes";
import userRouter from "./routes/UserRoutes";
const app = express();
const port = 5000;

app.use(express.json()); // For JSON payloads
app.use(express.urlencoded({ extended: true })); // For form-data (optional)
app.use(cookieParser())
app.use(cors(
  {
    origin: "http://localhost:3002",
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }
))

app.get ("/", (req, res) => {
  res.send("Hello World")
})

app.use('/auth', router)
app.use('/user', userRouter)

app.listen(port, () => {
  console.log(`Runinng on port ${port}`);
})
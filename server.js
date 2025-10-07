import dotenv from "dotenv";
dotenv.config();
import express from "express";
import route from "./routes/route.js";
const app = express();
app.use(express.json());
app.use("/", route);

app.listen(process.env.PORT, () => {
  console.log(`Server is runing on ${process.env.PORT}`);
});

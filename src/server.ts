import express from "express";
import { ErrorHandler } from "./middleware/error";
import cors from "cors";
import { config } from "dotenv";
import database from "./utils/database/db";
import AuthRouter from "./modules/auth/auth.routes";
config();

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());
app.use(cors());

database.connect();

// Add routes here
app.use("/auth", AuthRouter);

app.use('*', ErrorHandler.pagenotFound());
app.use(ErrorHandler.handle());
ErrorHandler.exceptionRejectionHandler();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


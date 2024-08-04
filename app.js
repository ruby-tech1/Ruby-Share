import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import "./events/index.js";

import express from "express";
const app = express();

// Database Connection
import connectDB from "./config/connectDb.js";

// Extra Packages
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimiter from "express-rate-limit";

// Routes
import AuthRouter from "./routes/AuthRouter.js";
import UserRouter from "./routes/UserRouter.js";
import FileRouter from "./routes/FileRouter.js";
import UrlRouter from "./routes/UrlRouter.js";

// Cron Job
import cronJob from "./cron_jobs/index.js";

import { AutheticateUser } from "./middleware/authentication.js";

// Error Handlers
import ErrorHandlerMiddleware from "./middleware/error-handler.js";
import NotFoundMiddleware from "./middleware/error-handler.js";

app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(
  fileUpload({
    limits: { fileSize: process.env.FILE_MAXSIZE },
    abortOnLimit: true,
    limitHandler: (req, res) => {
      res.status(400).json("file is larger");
    },
    useTempFiles: true,
    // tempFileDir: "./fileUploads",
    preserveExtension: 10,
    // responseOnLimit: "file is larger",
  })
);
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("tiny"));
}

const limiter = rateLimiter({
  windowMs: 15 * 60 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip.replace(/:\d+[^:]*$/, ""),
});
app.use(cors());
app.use(helmet());
app.use(xss());

// Routes
// app.get('/api/v1/docs', )

app.use("/api/v1/auth", limiter, AuthRouter);
app.use("/api/v1/user", limiter, AutheticateUser, UserRouter);
app.use("/api/v1/file", AutheticateUser, FileRouter);
app.use("/api/v1/url", AutheticateUser, UrlRouter);

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
// });

// Error
app.use(NotFoundMiddleware);
app.use(ErrorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB.sync();
    console.log("Database Connected");
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
    cronJob();
  } catch (error) {
    console.log(error);
  }
};

start();

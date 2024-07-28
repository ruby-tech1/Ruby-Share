import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";

import express from "express";
const app = express();
import path from "path";
import url from "url";

// Database Connection
import connectDB from "./db/connect.js";

// Extra Packages
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import cors from "cors";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import rateLimiter from "express-rate-limit";

// Routes
import AuthRouter from "./routes/AuthRouter.js";
import UserRouter from "./routes/UserRouter.js";
import FileRouter from "./routes/FileRouter.js";

import { AutheticateUser } from "./middleware/authentication.js";

// Error Handlers
import ErrorHandlerMiddleware from "./middleware/error-handler.js";
import NotFoundMiddleware from "./middleware/error-handler.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use(morgan("tiny"));

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 60 * 1000,
    max: 60,
  })
);
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(ExpressMongoSanitize());

// Routes
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/user", AutheticateUser, UserRouter);
app.use("/api/v1/file", AutheticateUser, FileRouter);

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
// });

// Error
app.use(NotFoundMiddleware);
app.use(ErrorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Database Connected");
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

import express from "express";
const router = express.Router();

import {
  createFile,
  getAllFiles,
  getSingleFile,
  updateFile,
  deleteFIle,
} from "../controllers/FileController.js";

router.route("/").post(createFile).get(getAllFiles);
router.route("/:id").get(getSingleFile).patch(updateFile).delete(deleteFIle);

export default router;

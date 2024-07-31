import express from "express";
const router = express.Router();

import { GetUrl } from "../controllers/UrlController.js";

router.route("/:id").get(GetUrl);

export default router;

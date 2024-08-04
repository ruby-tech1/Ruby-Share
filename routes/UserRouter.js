import express from "express";
const router = express.Router();

import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/UserController.js";
import { authorizePermissions } from "../middleware/authentication.js";

// router.route("/").get(authorizePermissions("admin"), getAllUsers);
router.route("/").get(getAllUsers);
router.route("/showMe").get(showCurrentUser);
router.route("/updateUser").patch(updateUser);
router.route("/updateUserPassword").patch(updateUserPassword);
router.route("/:id").get(getSingleUser);

export default router;

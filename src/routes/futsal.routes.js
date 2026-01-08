import express from "express";
import {
  create,
  getAll,
  getById,
  remove,
  update
} from "../controllers/futsal.controllers.js";

import { uploadFile } from "../middleware/multer.middleware.js";
import { USER_ROLE } from "../constants/enums.constants.js";
import authenticate from "../middleware/authenticate.middleware.js";

const router = express.Router();
const upload = uploadFile("/futsal");

router.get("/getAll", getAll);
router.get("/:id", getById);

router.post(
  "/create",
  upload.single("image"),
  create
);

router.put(
  "/:id",
  upload.single("image"),
  update
);

router.delete(
  "/:id",
  remove
);

export default router;

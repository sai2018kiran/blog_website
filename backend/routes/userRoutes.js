import express from "express";
import {
  signupUser,
  loginUser,
  getUserProfile,
  getUserBlogCount,
  updateUser,
  deleteUser,
  changePassword,
  updateProfileImage,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);

router.get("/:id", getUserProfile);
router.get("/:id/blogs/count", getUserBlogCount);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/password", changePassword);
router.put("/:id/profile-image", updateProfileImage);
router.put("/:id/password", changePassword);


export default router;

import express from "express";
import {
  getAllUsers,
  getMyprofile,
  login,
  logout,
  register,
} from "../controllers/user_controllers.js";
import { isAuthenticated } from "../middlewares/user_auth.js";
import { User } from "../models/User.js";

const router = express.Router();

router.post("/new", register);
router.post("/login", login);
router.get("/logout", logout);

router.get("/all", getAllUsers);

router.patch("/chage-role", isAuthenticated, async (req, res) => {
  const { targetUserId, role } = req.body;
  const user = req.user;
  
  if (!targetUserId) {
    return res.status(404).json({ message: "please provide target user id" });
  }
  
  if (user.role !== "admin") {
    return res
      .status(400)
      .json({ message: "Not authorized to make this call" });
  }

  try {
    await User.updateRole(targetUserId, role);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating user role" });
  }
});

router.get("/me", isAuthenticated, getMyprofile);

export default router;
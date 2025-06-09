import express from "express";
import { Location } from "../models/Location.js";
import { isAuthenticated } from "../middlewares/user_auth.js";

const locationRouter = express.Router();

locationRouter.get("/", async (req, res) => {
  try {
    const locations = await Location.findAll();
    return res.status(200).json(locations || []);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

locationRouter.get("/:id", async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    return res.status(200).json(location || []);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

locationRouter.patch("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const editedBy = req.user.id;
    
    await Location.updateById(req.params.id, {
      name,
      description,
      editedBy,
    });

    return res.status(200).json();
  } catch (e) {
    throw next(e);
  }
});

locationRouter.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const createdBy = req.user.id;
    
    await Location.create({
      createdBy,
      name,
      description,
    });
    
    return res.status(200).json({ message: "Success" });
  } catch (e) {
    throw next(e);
  }
});

export default locationRouter;
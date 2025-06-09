import express from "express";
import { Company } from "../models/Company.js";
import { isAuthenticated } from "../middlewares/user_auth.js";

const companyRouter = express.Router();

companyRouter.get("/", async (req, res, next) => {
  try {
    const companies = await Company.findAll();
    return res.status(200).json(companies || []);
  } catch (e) {
    throw next(e);
  }
});

companyRouter.get("/:id", async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    return res.status(200).json(company);
  } catch (e) {
    throw next(e);
  }
});

companyRouter.patch("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const editedBy = req.user.id;

    await Company.updateById(req.params.id, {
      name,
      description,
      editedBy,
    });

    return res.status(200).json({ message: "Success" });
  } catch (e) {
    throw next(e);
  }
});

companyRouter.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const createdBy = req.user.id;

    await Company.create({
      createdBy,
      name,
      description,
    });
    
    return res.status(200).json({ message: "Success" });
  } catch (e) {
    throw next(e);
  }
});

export default companyRouter;
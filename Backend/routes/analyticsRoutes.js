import express from "express";
import { Product } from "../models/Product.js";

const analyticsRoutes = express.Router();

analyticsRoutes.get("/expiring", async (req, res) => {
  try {
    const { months = 1 } = req.query;  
    const expiringProducts = await Product.getExpiringProducts(parseInt(months));
    res.status(200).json(expiringProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

analyticsRoutes.get("/", async (req, res) => {
  try {
    const analytics = await Product.getAnalytics();
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default analyticsRoutes;
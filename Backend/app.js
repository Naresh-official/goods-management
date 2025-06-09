import express from "express";
import { initDatabase } from "./config/database.js";
import userRouter from "./routes/user_routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import productRouter from "./routes/productRoutes.js";
import companyRouter from "./routes/companyRoutes.js";
import locationRouter from "./routes/locationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

const app = express();
app.use(
	cors({
		origin: process.env.ORIGIN,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		credentials: true,
	})
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
initDatabase()
	.then(() => console.log("Connected to MySQL database"))
	.catch(console.error);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/brands", companyRouter);
app.use("/api/v1/location", locationRouter);
app.use("/api/v1/analytics", analyticsRoutes);

app.get("/", (req, res) => {
	res.send("<h1>working nicely</h1>");
});

app.use((error, req, res, next) => {
	console.log(error, error.message);
	return res.status(400).json({ message: "internal server error" });
});

app.listen(process.env.PORT, () => {
	console.log(
		`server is working at port:${process.env.PORT} in ${process.env.NODE_ENV} mode`
	);
});
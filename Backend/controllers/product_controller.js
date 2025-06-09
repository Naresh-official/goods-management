import { Product } from "../models/Product.js";

export const createProduct = async (req, res) => {
	if (req.user.role != "admin") {
		return res.status(403).json({ message: "not authorized" });
	}
	try {
		const {
			locationId,
			status,
			title,
			description,
			serialNo,
			rackMountable,
			isPart,
			manufacturer,
			model,
			warrantyMonths,
			dateOfPurchase,
			user,
		} = req.body;

		const productData = {
			title,
			description,
			serialNo,
			dateOfPurchase,
			createdBy: req.user.id,
			rackMountable,
			isPart,
			manufacturer,
			model,
			warrantyMonths,
			user,
		};

		const product = await Product.createWithHistory({
			productData,
			locationId,
			status
		});

		res.status(201).json(product);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getAllProducts = async (req, res) => {
	try {
		const {
			page = 1,
			itemsperpage = 10,
			search = "",
			manufacturer,
		} = req.query;

		const result = await Product.findAll({
			page,
			itemsperpage,
			search,
			manufacturer
		});

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		console.log("product", product);
		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getProductHistroy = async (req, res) => {
	try {
		const product = await Product.findByIdWithHistory(req.params.id);

		console.log("product", product);
		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const updateProductById = async (req, res) => {
	const productId = req.params.id;
	try {
		const updateData = req.body;
		await Product.updateById(productId, updateData);
		res.status(200).json({ message: "success" });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const deleteProductById = async (req, res) => {
	try {
		const deleted = await Product.deleteById(req.params.id);
		if (!deleted) {
			return res.status(404).json({ error: "Product not found" });
		}
		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
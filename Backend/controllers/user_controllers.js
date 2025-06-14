import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { sendcookie } from "../utils/user_utils.js";

export const getAllUsers = async (req, res) => {
	try {
		const {
			page = 1,
			itemsPerPage = 10,
			search = "",
			role, // Role parameter for filtering
		} = req.query;

		const result = await User.findAll({ page, itemsPerPage, search, role });

		res.status(200).json({
			success: true,
			users: result.users,
			totalPages: result.totalPages,
			currentPage: page,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findByEmail(email);
		
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "Register first",
			});
		}

		const encrypted = await bcrypt.compare(password, user.password);
		if (!encrypted) {
			return res.status(404).json({
				success: false,
				message: "your password is incorrect",
			});
		}

		sendcookie(user, res, `welcome back,${user.name}`, 201);
	} catch (e) {
		throw next(e);
	}
};

export const register = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;
		console.log("Entered here");
		
		let user = await User.findByEmail(email);
		console.log(user);
		
		if (user) {
			return res.status(400).json({
				success: false,
				message: "user already exists",
			});
		}

		const hashedpassword = await bcrypt.hash(password, 10);
		user = await User.create({ name, email, password: hashedpassword });

		sendcookie(user, res, "successfully registered", 201);
	} catch (e) {
		throw next(e);
	}
};

export const getMyprofile = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);
		res.status(200).json({
			success: true,
			message: `your profile is found ${req.user.name}`,
			user: user,
		});
	} catch (e) {
		throw next(e);
	}
};

export const logout = async (req, res, next) => {
	try {
		res.cookie("token", null, {
			expires: new Date(0),
			sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
			secure: process.env.NODE_ENV === "development" ? false : true,
		})
			.status(200)
			.json({
				success: true,
				message: "Successfully logout",
				user: req.user,
			});
	} catch (e) {
		throw next(e);
	}
};
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
	host: process.env.DB_HOST || "localhost",
	user: process.env.DB_USER || "root",
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	maxIdle: 10,
	idleTimeout: 60000,
	queueLimit: 0,
});

export async function initDatabase() {
	try {
		const connection = await pool.getConnection();

		// Users table
		await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

		// Companies table
		await connection.execute(`
			CREATE TABLE IF NOT EXISTS companies (
				id INT PRIMARY KEY AUTO_INCREMENT,
				name VARCHAR(255) NOT NULL,
				description TEXT NOT NULL,
				created_by INT NOT NULL,
				edited_by INT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (edited_by) REFERENCES users(id) ON DELETE SET NULL
			)
		`);

		// Locations table
		await connection.execute(`
			CREATE TABLE IF NOT EXISTS locations (
				id INT PRIMARY KEY AUTO_INCREMENT,
				name VARCHAR(255) NOT NULL,
				description TEXT NOT NULL,
				created_by INT NOT NULL,
				edited_by INT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (edited_by) REFERENCES users(id) ON DELETE SET NULL
			)
		`);

		// Products table
		await connection.execute(`
			CREATE TABLE IF NOT EXISTS products (
				id INT PRIMARY KEY AUTO_INCREMENT,
				title VARCHAR(255) NOT NULL,
				description TEXT,
				serial_no VARCHAR(255) NOT NULL,
				created_by INT NOT NULL,
				rack_mountable BOOLEAN DEFAULT FALSE,
				is_part BOOLEAN DEFAULT FALSE,
				manufacturer_id INT,
				model VARCHAR(255) NOT NULL,
				date_of_purchase DATE NOT NULL,
				warranty_months INT NOT NULL,
				user_type ENUM('normal user', 'department', 'admin') DEFAULT 'normal user',
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (manufacturer_id) REFERENCES companies(id) ON DELETE SET NULL
			)
		`);

		// History table
		await connection.execute(`
			CREATE TABLE IF NOT EXISTS history (
				id INT PRIMARY KEY AUTO_INCREMENT,
				product_id INT NOT NULL,
				location_id INT NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
				FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
			)
		`);

		// Status table for history status tracking
		await connection.execute(`
			CREATE TABLE IF NOT EXISTS status (
				id INT PRIMARY KEY AUTO_INCREMENT,
				history_id INT NOT NULL,
				name ENUM('repair', 'in use', 'not in use') NOT NULL,
				date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (history_id) REFERENCES history(id) ON DELETE CASCADE
			)
		`);

		connection.release();
		console.log("Database initialized successfully with relationships.");
	} catch (error) {
		console.error("Error initializing database:", error);
		throw error;
	}
}

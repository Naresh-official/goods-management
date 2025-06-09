import { pool } from "../config/database.js";

export class Location {
	static async create({ name, description, createdBy }) {
		const [result] = await pool.execute(
			"INSERT INTO locations (name, description, created_by) VALUES (?, ?, ?)",
			[name, description, createdBy]
		);

		return await this.findById(result.insertId);
	}

	static async findById(id) {
		const [rows] = await pool.execute(
			`
      SELECT l.*, 
             cb.name as created_by_name, cb.email as created_by_email,
             eb.name as edited_by_name, eb.email as edited_by_email
      FROM locations l
      LEFT JOIN users cb ON l.created_by = cb.id
      LEFT JOIN users eb ON l.edited_by = eb.id
      WHERE l.id = ?
    `,
			[id]
		);

		if (rows[0]) {
			const location = {
				_id: rows[0].id,
				name: rows[0].name,
				description: rows[0].description,
				createdAt: rows[0].created_at,
			};

			if (rows[0].created_by_name) {
				location.createdBy = {
					name: rows[0].created_by_name,
					email: rows[0].created_by_email,
				};
			}

			if (rows[0].edited_by_name) {
				location.editedBy = {
					name: rows[0].edited_by_name,
					email: rows[0].edited_by_email,
				};
			}

			return location;
		}
		return null;
	}

	static async findAll() {
		const [rows] = await pool.execute(`
      SELECT l.*, 
             cb.name as created_by_name, cb.email as created_by_email,
             eb.name as edited_by_name, eb.email as edited_by_email
      FROM locations l
      LEFT JOIN users cb ON l.created_by = cb.id
      LEFT JOIN users eb ON l.edited_by = eb.id
      ORDER BY l.created_at DESC
    `);

		return rows.map((row) => {
			const location = {
				_id: row.id,
				name: row.name,
				description: row.description,
				createdAt: row.created_at,
			};

			if (row.created_by_name) {
				location.createdBy = {
					name: row.created_by_name,
					email: row.created_by_email,
				};
			}

			if (row.edited_by_name) {
				location.editedBy = {
					name: row.edited_by_name,
					email: row.edited_by_email,
				};
			}

			return location;
		});
	}

	static async updateById(id, { name, description, editedBy }) {
		const [result] = await pool.execute(
			"UPDATE locations SET name = ?, description = ?, edited_by = ? WHERE id = ?",
			[name, description, editedBy, id]
		);
		return result.affectedRows > 0;
	}

	static async deleteById(id) {
		const [result] = await pool.execute(
			"DELETE FROM locations WHERE id = ?",
			[id]
		);
		return result.affectedRows > 0;
	}
}

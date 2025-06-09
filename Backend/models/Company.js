import { pool } from "../config/database.js";

export class Company {
  static async create({ name, description, createdBy }) {
    const [result] = await pool.execute(
      'INSERT INTO companies (name, description, created_by) VALUES (?, ?, ?)',
      [name, description, createdBy]
    );
    
    return await this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.execute(`
      SELECT c.*, 
             cb.name as created_by_name, cb.email as created_by_email,
             eb.name as edited_by_name, eb.email as edited_by_email
      FROM companies c
      LEFT JOIN users cb ON c.created_by = cb.id
      LEFT JOIN users eb ON c.edited_by = eb.id
      WHERE c.id = ?
    `, [id]);
    
    if (rows[0]) {
      const company = {
        _id: rows[0].id,
        name: rows[0].name,
        description: rows[0].description,
        createdAt: rows[0].created_at,
        updatedAt: rows[0].updated_at
      };

      if (rows[0].created_by_name) {
        company.createdBy = {
          name: rows[0].created_by_name,
          email: rows[0].created_by_email
        };
      }

      if (rows[0].edited_by_name) {
        company.editedBy = {
          name: rows[0].edited_by_name,
          email: rows[0].edited_by_email
        };
      }

      return company;
    }
    return null;
  }

  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT c.*, 
             cb.name as created_by_name, cb.email as created_by_email,
             eb.name as edited_by_name, eb.email as edited_by_email
      FROM companies c
      LEFT JOIN users cb ON c.created_by = cb.id
      LEFT JOIN users eb ON c.edited_by = eb.id
      ORDER BY c.created_at DESC
    `);

    return rows.map(row => {
      const company = {
        _id: row.id,
        name: row.name,
        description: row.description,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };

      if (row.created_by_name) {
        company.createdBy = {
          name: row.created_by_name,
          email: row.created_by_email
        };
      }

      if (row.edited_by_name) {
        company.editedBy = {
          name: row.edited_by_name,
          email: row.edited_by_email
        };
      }

      return company;
    });
  }

  static async updateById(id, { name, description, editedBy }) {
    const [result] = await pool.execute(
      'UPDATE companies SET name = ?, description = ?, edited_by = ? WHERE id = ?',
      [name, description, editedBy, id]
    );
    return result.affectedRows > 0;
  }

  static async deleteById(id) {
    const [result] = await pool.execute(
      'DELETE FROM companies WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}
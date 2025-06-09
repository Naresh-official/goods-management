import { pool } from "../config/database.js";

export class User {
  static async create({ name, email, password, role = 'user' }) {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    
    return await this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  static async findAll({ page = 1, itemsPerPage = 10, search = "", role = "" }) {
    let query = 'SELECT * FROM users WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const params = [];
    const countParams = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      countQuery += ' AND (name LIKE ? OR email LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam);
      countParams.push(searchParam, searchParam);
    }

    if (role) {
      query += ' AND role = ?';
      countQuery += ' AND role = ?';
      params.push(role);
      countParams.push(role);
    }

    const offset = (page - 1) * itemsPerPage;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(itemsPerPage), offset);

    const [users] = await pool.execute(query, params);
    const [countResult] = await pool.execute(countQuery, countParams);
    const totalUsers = countResult[0].total;
    const totalPages = Math.ceil(totalUsers / itemsPerPage);

    return {
      users,
      totalPages,
      currentPage: parseInt(page)
    };
  }

  static async updateRole(id, role) {
    const [result] = await pool.execute(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );
    return result.affectedRows > 0;
  }

  static async deleteById(id) {
    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}
import { pool } from "../config/database.js";

export class Product {
  static async create(productData) {
    const {
      title, description, serialNo, createdBy, rackMountable,
      isPart, manufacturer, model, warrantyMonths, dateOfPurchase, user
    } = productData;

    const [result] = await pool.execute(`
      INSERT INTO products (
        title, description, serial_no, created_by, rack_mountable,
        is_part, manufacturer_id, model, warranty_months, date_of_purchase, user_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title, description, serialNo, createdBy, rackMountable,
      isPart, manufacturer, model, warrantyMonths, dateOfPurchase, user
    ]);

    return await this.findById(result.insertId);
  }

  static async createWithHistory({ productData, locationId, status }) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Create product
      const [productResult] = await connection.execute(`
        INSERT INTO products (
          title, description, serial_no, created_by, rack_mountable,
          is_part, manufacturer_id, model, warranty_months, date_of_purchase, user_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        productData.title, productData.description, productData.serialNo,
        productData.createdBy, productData.rackMountable, productData.isPart,
        productData.manufacturer, productData.model, productData.warrantyMonths,
        productData.dateOfPurchase, productData.user
      ]);

      const productId = productResult.insertId;

      // Create history entry
      const [historyResult] = await connection.execute(
        'INSERT INTO history (product_id, location_id) VALUES (?, ?)',
        [productId, locationId]
      );

      // Create status entry
      await connection.execute(
        'INSERT INTO status (history_id, name) VALUES (?, ?)',
        [historyResult.insertId, status]
      );

      await connection.commit();
      return await this.findById(productId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const [rows] = await pool.execute(`
      SELECT p.*, 
             u.name as created_by_name, u.email as created_by_email,
             c.name as manufacturer_name
      FROM products p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN companies c ON p.manufacturer_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (rows[0]) {
      return {
        _id: rows[0].id,
        title: rows[0].title,
        description: rows[0].description,
        serialNo: rows[0].serial_no,
        rackMountable: rows[0].rack_mountable,
        isPart: rows[0].is_part,
        manufacturer: rows[0].manufacturer_id,
        model: rows[0].model,
        warrantyMonths: rows[0].warranty_months,
        dateOfPurchase: rows[0].date_of_purchase,
        user: rows[0].user_type,
        createdAt: rows[0].created_at,
        createdBy: {
          name: rows[0].created_by_name,
          email: rows[0].created_by_email
        }
      };
    }
    return null;
  }

  static async findByIdWithHistory(id) {
    // Get product details
    const product = await this.findById(id);
    if (!product) return null;

    // Get manufacturer details
    const [manufacturerRows] = await pool.execute(
      'SELECT * FROM companies WHERE id = ?',
      [product.manufacturer]
    );

    if (manufacturerRows[0]) {
      product.manufacturer = {
        _id: manufacturerRows[0].id,
        name: manufacturerRows[0].name
      };
    }

    // Get history with locations and status
    const [historyRows] = await pool.execute(`
      SELECT h.id as history_id, h.created_at as history_created_at,
             l.id as location_id, l.name as location_name, l.description as location_description,
             s.id as status_id, s.name as status_name, s.date as status_date
      FROM history h
      LEFT JOIN locations l ON h.location_id = l.id
      LEFT JOIN status s ON h.id = s.history_id
      WHERE h.product_id = ?
      ORDER BY h.created_at DESC, s.date DESC
    `, [id]);

    // Group history by history_id
    const historyMap = new Map();
    
    historyRows.forEach(row => {
      if (!historyMap.has(row.history_id)) {
        historyMap.set(row.history_id, {
          _id: row.history_id,
          location: {
            _id: row.location_id,
            name: row.location_name,
            description: row.location_description
          },
          status: []
        });
      }
      
      if (row.status_id) {
        historyMap.get(row.history_id).status.push({
          _id: row.status_id,
          name: row.status_name,
          date: row.status_date
        });
      }
    });

    product.history = Array.from(historyMap.values());
    return product;
  }

  static async findAll({ page = 1, itemsperpage = 10, search = "", manufacturer = "" }) {
    let query = `
      SELECT p.*, 
             u.name as created_by_name,
             c.name as manufacturer_name,
             h.location_id,
             l.name as location_name,
             s.name as current_status
      FROM products p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN companies c ON p.manufacturer_id = c.id
      LEFT JOIN history h ON p.id = h.product_id
      LEFT JOIN locations l ON h.location_id = l.id
      LEFT JOIN status s ON h.id = s.history_id
      WHERE 1=1
    `;

    let countQuery = 'SELECT COUNT(DISTINCT p.id) as total FROM products p WHERE 1=1';
    const params = [];
    const countParams = [];

    if (search) {
      const searchCondition = ' AND (p.title LIKE ? OR p.description LIKE ? OR p.serial_no LIKE ? OR p.model LIKE ?)';
      query += searchCondition;
      countQuery += searchCondition;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
      countParams.push(searchParam, searchParam, searchParam, searchParam);
    }

    if (manufacturer) {
      query += ' AND p.manufacturer_id = ?';
      countQuery += ' AND p.manufacturer_id = ?';
      params.push(manufacturer);
      countParams.push(manufacturer);
    }

    // Get total count
    const [countResult] = await pool.execute(countQuery, countParams);
    const totalCount = countResult[0].total;
    const pages_count = Math.ceil(totalCount / itemsperpage);

    // Add pagination
    const offset = (page - 1) * itemsperpage;
    query += ' GROUP BY p.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(itemsperpage), offset);

    const [rows] = await pool.execute(query, params);

    const products = rows.map(row => ({
      _id: row.id,
      title: row.title,
      description: row.description,
      serialNo: row.serial_no,
      rackMountable: row.rack_mountable,
      isPart: row.is_part,
      model: row.model,
      warrantyMonths: row.warranty_months,
      dateOfPurchase: row.date_of_purchase,
      user: row.user_type,
      createdBy: row.created_by,
      manufacturer: {
        _id: row.manufacturer_id,
        name: row.manufacturer_name
      },
      history: [{
        location: {
          _id: row.location_id,
          name: row.location_name
        },
        status: [{
          name: row.current_status
        }]
      }]
    }));

    return {
      data: products,
      pages_count,
      currentPage: parseInt(page)
    };
  }

  static async updateById(id, updateData) {
    const {
      locationId, status, title, description, serialNo,
      rackMountable, isPart, manufacturer, model, warrantyMonths, user
    } = updateData;

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Update product basic info
      if (title || description || serialNo || rackMountable !== undefined || 
          isPart !== undefined || manufacturer || model || warrantyMonths || user) {
        
        let updateQuery = 'UPDATE products SET ';
        const updateParams = [];
        const updateFields = [];

        if (title) {
          updateFields.push('title = ?');
          updateParams.push(title);
        }
        if (description) {
          updateFields.push('description = ?');
          updateParams.push(description);
        }
        if (serialNo) {
          updateFields.push('serial_no = ?');
          updateParams.push(serialNo);
        }
        if (rackMountable !== undefined) {
          updateFields.push('rack_mountable = ?');
          updateParams.push(rackMountable);
        }
        if (isPart !== undefined) {
          updateFields.push('is_part = ?');
          updateParams.push(isPart);
        }
        if (manufacturer) {
          updateFields.push('manufacturer_id = ?');
          updateParams.push(manufacturer);
        }
        if (model) {
          updateFields.push('model = ?');
          updateParams.push(model);
        }
        if (warrantyMonths) {
          updateFields.push('warranty_months = ?');
          updateParams.push(warrantyMonths);
        }
        if (user) {
          updateFields.push('user_type = ?');
          updateParams.push(user);
        }

        updateQuery += updateFields.join(', ') + ' WHERE id = ?';
        updateParams.push(id);

        await connection.execute(updateQuery, updateParams);
      }

      // Handle location change
      if (locationId) {
        const [historyResult] = await connection.execute(
          'INSERT INTO history (product_id, location_id) VALUES (?, ?)',
          [id, locationId]
        );

        if (status) {
          await connection.execute(
            'INSERT INTO status (history_id, name) VALUES (?, ?)',
            [historyResult.insertId, status]
          );
        }
      } else if (status) {
        // Add status to existing history
        const [historyRows] = await connection.execute(
          'SELECT id FROM history WHERE product_id = ? ORDER BY created_at DESC LIMIT 1',
          [id]
        );

        if (historyRows[0]) {
          await connection.execute(
            'INSERT INTO status (history_id, name) VALUES (?, ?)',
            [historyRows[0].id, status]
          );
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteById(id) {
    const [result] = await pool.execute(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async getExpiringProducts(months) {
    const [rows] = await pool.execute(`
      SELECT p.*, 
             u.name as created_by_name,
             c.name as manufacturer_name,
             h.location_id,
             l.name as location_name,
             s.name as current_status
      FROM products p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN companies c ON p.manufacturer_id = c.id
      LEFT JOIN history h ON p.id = h.product_id
      LEFT JOIN locations l ON h.location_id = l.id
      LEFT JOIN status s ON h.id = s.history_id
      WHERE DATE_ADD(p.date_of_purchase, INTERVAL p.warranty_months MONTH) <= DATE_ADD(NOW(), INTERVAL ? MONTH)
      GROUP BY p.id
      ORDER BY p.date_of_purchase ASC
    `, [months]);

    return rows.map(row => ({
      _id: row.id,
      title: row.title,
      description: row.description,
      serialNo: row.serial_no,
      warrantyMonths: row.warranty_months,
      dateOfPurchase: row.date_of_purchase,
      createdBy: {
        name: row.created_by_name
      },
      manufacturer: {
        name: row.manufacturer_name
      },
      history: [{
        location: {
          name: row.location_name
        },
        status: [{
          name: row.current_status
        }]
      }]
    }));
  }

  static async getAnalytics() {
    // Get product usage by user
    const [usebyRows] = await pool.execute(`
      SELECT user_type as _id, COUNT(*) as count
      FROM products
      GROUP BY user_type
    `);

    const useby = {
      title: "Products used by",
      labels: usebyRows.map(row => row._id),
      data: usebyRows.map(row => row.count)
    };

    // Get warranty status
    const [warrantyRows] = await pool.execute(`
      SELECT 
        CASE 
          WHEN DATE_ADD(date_of_purchase, INTERVAL warranty_months MONTH) > NOW() 
          THEN 'in warranty' 
          ELSE 'not in warranty' 
        END as status,
        COUNT(*) as count
      FROM products
      GROUP BY status
    `);

    const expiry = {
      title: "Warranty",
      labels: warrantyRows.map(row => row.status),
      data: warrantyRows.map(row => row.count)
    };

    // Get product status
    const [statusRows] = await pool.execute(`
      SELECT s.name as _id, COUNT(*) as count
      FROM status s
      INNER JOIN history h ON s.history_id = h.id
      GROUP BY s.name
    `);

    const status = {
      title: "Product Status",
      labels: statusRows.map(row => row._id),
      data: statusRows.map(row => row.count)
    };

    return { useby, expiry, status };
  }
}
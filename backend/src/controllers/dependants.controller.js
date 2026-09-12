const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const dependantsController = {
  getAllDependants: async (req, res) => {
    try {
      const { memberId, page = 1, limit = 20, relationship, isBeneficiary } = req.query;
      const offset = (page - 1) * limit;

      let query = 'SELECT * FROM dependants WHERE 1=1';
      const params = [];

      if (memberId) {
        query += ' AND member_id = $' + (params.length + 1);
        params.push(memberId);
      }

      if (relationship) {
        query += ' AND relationship = $' + (params.length + 1);
        params.push(relationship);
      }

      if (isBeneficiary !== undefined) {
        query += ' AND is_beneficiary = $' + (params.length + 1);
        params.push(isBeneficiary === 'true');
      }

      query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);

      const result = await db.query(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) FROM dependants WHERE 1=1';
      const countParams = [];
      if (memberId) {
        countQuery += ' AND member_id = $' + (countParams.length + 1);
        countParams.push(memberId);
      }
      if (relationship) {
        countQuery += ' AND relationship = $' + (countParams.length + 1);
        countParams.push(relationship);
      }
      if (isBeneficiary !== undefined) {
        countQuery += ' AND is_beneficiary = $' + (countParams.length + 1);
        countParams.push(isBeneficiary === 'true');
      }

      const countResult = await db.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);

      res.json({
        data: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get dependants error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getDependantById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await db.query(
        `SELECT d.*, m.member_code, m.first_name as member_first_name, m.last_name as member_last_name
        FROM dependants d
        JOIN members m ON d.member_id = m.id
        WHERE d.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Dependant not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createDependant: async (req, res) => {
    try {
      const {
        memberId, firstName, lastName, relationship, dateOfBirth,
        gender, idNumber, phoneNumber, email, isBeneficiary, healthStatus, notes
      } = req.body;

      if (!memberId || !firstName || !lastName || !relationship) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Verify member exists
      const memberCheck = await db.query('SELECT id FROM members WHERE id = $1', [memberId]);
      if (memberCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Member not found' });
      }

      const dependantId = uuidv4();
      const result = await db.query(
        `INSERT INTO dependants 
        (id, member_id, first_name, last_name, relationship, date_of_birth, gender, id_number, phone_number, email, is_beneficiary, health_status, notes) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
        RETURNING *`,
        [dependantId, memberId, firstName, lastName, relationship, dateOfBirth, gender, idNumber, phoneNumber, email, isBeneficiary !== false, healthStatus, notes]
      );

      res.status(201).json({
        message: 'Dependant created successfully',
        dependant: result.rows[0]
      });
    } catch (error) {
      console.error('Create dependant error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  updateDependant: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const setClause = Object.keys(updates).map((key, index) => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return `${dbKey} = $${index + 1}`;
      }).join(', ');

      const values = Object.values(updates);
      values.push(id);

      const result = await db.query(
        `UPDATE dependants SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Dependant not found' });
      }

      res.json({
        message: 'Dependant updated successfully',
        dependant: result.rows[0]
      });
    } catch (error) {
      console.error('Update dependant error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  deleteDependant: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await db.query('DELETE FROM dependants WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Dependant not found' });
      }

      res.json({ message: 'Dependant deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getMemberDependants: async (req, res) => {
    try {
      const { memberId } = req.params;
      const result = await db.query(
        'SELECT * FROM dependants WHERE member_id = $1 ORDER BY created_at DESC',
        [memberId]
      );

      res.json({
        memberId,
        dependants: result.rows,
        total: result.rows.length
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = dependantsController;

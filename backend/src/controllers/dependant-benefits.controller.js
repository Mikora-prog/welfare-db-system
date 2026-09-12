const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const dependantBenefitsController = {
  getAllBenefits: async (req, res) => {
    try {
      const { dependantId, status, page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      let query = `SELECT db.*, d.first_name, d.last_name, m.member_code
                   FROM dependant_benefits db
                   JOIN dependants d ON db.dependant_id = d.id
                   JOIN members m ON d.member_id = m.id
                   WHERE 1=1`;
      const params = [];

      if (dependantId) {
        query += ' AND db.dependant_id = $' + (params.length + 1);
        params.push(dependantId);
      }

      if (status) {
        query += ' AND db.status = $' + (params.length + 1);
        params.push(status);
      }

      query += ' ORDER BY db.benefit_date DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);

      const result = await db.query(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) FROM dependant_benefits WHERE 1=1';
      const countParams = [];
      if (dependantId) {
        countQuery += ' AND dependant_id = $' + (countParams.length + 1);
        countParams.push(dependantId);
      }
      if (status) {
        countQuery += ' AND status = $' + (countParams.length + 1);
        countParams.push(status);
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
      console.error('Get benefits error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getBenefitById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await db.query(
        `SELECT db.*, d.first_name, d.last_name, m.member_code
        FROM dependant_benefits db
        JOIN dependants d ON db.dependant_id = d.id
        JOIN members m ON d.member_id = m.id
        WHERE db.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Benefit record not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createBenefit: async (req, res) => {
    try {
      const { dependantId, benefitType, amount, benefitDate, expiryDate, status, notes } = req.body;

      if (!dependantId || !benefitType) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Verify dependant exists
      const dependantCheck = await db.query('SELECT id FROM dependants WHERE id = $1', [dependantId]);
      if (dependantCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Dependant not found' });
      }

      const benefitId = uuidv4();
      const result = await db.query(
        `INSERT INTO dependant_benefits 
        (id, dependant_id, benefit_type, amount, benefit_date, expiry_date, status, notes, approved_by) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *`,
        [benefitId, dependantId, benefitType, amount, benefitDate || new Date().toISOString().split('T')[0], expiryDate, status || 'active', notes, req.user.id]
      );

      res.status(201).json({
        message: 'Benefit created successfully',
        benefit: result.rows[0]
      });
    } catch (error) {
      console.error('Create benefit error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  updateBenefit: async (req, res) => {
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
        `UPDATE dependant_benefits SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Benefit not found' });
      }

      res.json({
        message: 'Benefit updated successfully',
        benefit: result.rows[0]
      });
    } catch (error) {
      console.error('Update benefit error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  deleteBenefit: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await db.query('DELETE FROM dependant_benefits WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Benefit not found' });
      }

      res.json({ message: 'Benefit deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getDependantBenefits: async (req, res) => {
    try {
      const { dependantId } = req.params;
      const result = await db.query(
        'SELECT * FROM dependant_benefits WHERE dependant_id = $1 ORDER BY benefit_date DESC',
        [dependantId]
      );

      res.json({
        dependantId,
        benefits: result.rows,
        total: result.rows.length
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = dependantBenefitsController;

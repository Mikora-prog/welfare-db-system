const db = require('../config/database');

const dashboardController = {
  getOverview: async (req, res) => {
    try {
      // Total members
      const membersResult = await db.query('SELECT COUNT(*) as total FROM members');
      const totalMembers = membersResult.rows[0].total;

      // Active members
      const activeResult = await db.query("SELECT COUNT(*) as total FROM members WHERE membership_status = 'active'");
      const activeMembers = activeResult.rows[0].total;

      // Total dependants
      const dependantsResult = await db.query('SELECT COUNT(*) as total FROM dependants');
      const totalDependants = dependantsResult.rows[0].total;

      // Total payments
      const paymentsResult = await db.query('SELECT SUM(amount) as total FROM payments WHERE is_verified = true');
      const totalPayments = paymentsResult.rows[0].total || 0;

      // This month's payments
      const monthResult = await db.query(`
        SELECT SUM(amount) as total FROM payments 
        WHERE EXTRACT(MONTH FROM payment_date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM payment_date) = EXTRACT(YEAR FROM CURRENT_DATE)
        AND is_verified = true
      `);
      const thisMonthPayments = monthResult.rows[0].total || 0;

      res.json({
        totalMembers: parseInt(totalMembers),
        activeMembers: parseInt(activeMembers),
        totalDependants: parseInt(totalDependants),
        totalPayments: parseFloat(totalPayments),
        thisMonthPayments: parseFloat(thisMonthPayments)
      });
    } catch (error) {
      console.error('Dashboard overview error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getMetrics: async (req, res) => {
    try {
      // Payment methods distribution
      const methodsResult = await db.query(`
        SELECT payment_method, COUNT(*) as count, SUM(amount) as total
        FROM payments
        WHERE payment_method IS NOT NULL
        GROUP BY payment_method
      `);

      // Member status distribution
      const statusResult = await db.query(`
        SELECT membership_status, COUNT(*) as count
        FROM members
        GROUP BY membership_status
      `);

      // Recent payments
      const recentResult = await db.query(`
        SELECT p.id, m.member_code, m.first_name, m.last_name, p.amount, p.payment_date
        FROM payments p
        JOIN members m ON p.member_id = m.id
        ORDER BY p.payment_date DESC
        LIMIT 10
      `);

      res.json({
        payment_methods: methodsResult.rows,
        member_status: statusResult.rows,
        recent_payments: recentResult.rows
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getChartData: async (req, res) => {
    try {
      // Monthly payment trends
      const trendsResult = await db.query(`
        SELECT 
          TO_CHAR(payment_date, 'YYYY-MM') as month,
          COUNT(*) as payment_count,
          SUM(amount) as total_amount
        FROM payments
        WHERE is_verified = true
        GROUP BY TO_CHAR(payment_date, 'YYYY-MM')
        ORDER BY month DESC
        LIMIT 12
      `);

      // Payment type distribution
      const typeResult = await db.query(`
        SELECT pt.name, COUNT(p.id) as count, SUM(p.amount) as total
        FROM payments p
        JOIN payment_types pt ON p.payment_type_id = pt.id
        WHERE p.is_verified = true
        GROUP BY pt.name
      `);

      res.json({
        monthly_trends: trendsResult.rows,
        payment_types: typeResult.rows
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = dashboardController;

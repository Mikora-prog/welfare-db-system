import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import { dashboardService } from '../../services/api';

const DashboardPage = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getOverview();
        setOverview(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  const stats = [
    { label: 'Total Members', value: overview?.totalMembers || 0, color: '#1976d2' },
    { label: 'Active Members', value: overview?.activeMembers || 0, color: '#4caf50' },
    { label: 'Total Dependants', value: overview?.totalDependants || 0, color: '#ff9800' },
    { label: 'This Month Payments', value: `KES ${overview?.thisMonthPayments?.toFixed(2) || 0}`, color: '#2196f3' }
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Dashboard</Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 3, background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}cc 100%)`, color: 'white' }}>
              <Typography color="inherit" gutterBottom>
                {stat.label}
              </Typography>
              <Typography variant="h4">{stat.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DashboardPage;

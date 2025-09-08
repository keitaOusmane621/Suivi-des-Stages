import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react';
import './StatsCharts.css';

const StatsCharts = ({ stats }) => {
  // Données pour le diagramme à barres
  const barChartData = [
    { name: 'Étudiants', value: stats.totalStudents || 0 },
    { name: 'Entreprises', value: stats.totalCompanies || 0 },
    { name: 'Offres', value: stats.totalOffers || 0 },
    { name: 'Candidatures', value: stats.totalApplications || 0 }
  ];

  // Données pour le diagramme circulaire (statuts des candidatures)
  const pieChartData = [
    { name: 'En attente', value: stats.pendingApplications || 0 },
    { name: 'Acceptées', value: stats.acceptedApplications || 0 },
    { name: 'Refusées', value: stats.rejectedApplications || 0 }
  ];

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1'];

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="stats-charts">
      <h2>📊 Tableau de Bord Statistiques</h2>
      
      {/* Cartes de statistiques */}
      <div className="stats-grid">
        <StatCard 
          icon={Users} 
          title="Étudiants" 
          value={stats.totalStudents || 0} 
          color="#FF6B6B" 
        />
        <StatCard 
          icon={Briefcase} 
          title="Entreprises" 
          value={stats.totalCompanies || 0} 
          color="#4ECDC4" 
        />
        <StatCard 
          icon={FileText} 
          title="Offres" 
          value={stats.totalOffers || 0} 
          color="#45B7D1" 
        />
        <StatCard 
          icon={TrendingUp} 
          title="Candidatures" 
          value={stats.totalApplications || 0} 
          color="#96CEB4" 
        />
      </div>

      {/* Graphiques */}
      <div className="charts-grid">
        {/* Diagramme à barres */}
        <div className="chart-container">
          <h3>Répartition des données</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Diagramme circulaire */}
        <div className="chart-container">
          <h3>Statut des candidatures</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="detailed-stats">
        <h3>📈 Détails des candidatures</h3>
        <div className="stats-details">
          <div className="stat-detail">
            <span className="stat-label">En attente:</span>
            <span className="stat-number" style={{ color: '#FF6B6B' }}>
              {stats.pendingApplications || 0}
            </span>
          </div>
          <div className="stat-detail">
            <span className="stat-label">Acceptées:</span>
            <span className="stat-number" style={{ color: '#4ECDC4' }}>
              {stats.acceptedApplications || 0}
            </span>
          </div>
          <div className="stat-detail">
            <span className="stat-label">Refusées:</span>
            <span className="stat-number" style={{ color: '#45B7D1' }}>
              {stats.rejectedApplications || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCharts;
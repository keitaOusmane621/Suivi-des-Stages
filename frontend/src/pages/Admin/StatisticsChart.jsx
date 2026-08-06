import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#8b5cf6'];

const StatisticsChart = ({ chartData, isDarkMode }) => {
  const textColor = isDarkMode ? '#f1f5f9' : '#1f2937';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';

  return (
    <div className="chart-section">
      <div className="chart-header">
        <h3>📊 Répartition des entités</h3>
        <div className="chart-legend">
          <span className="legend-item students">Étudiants</span>
          <span className="legend-item companies">Entreprises</span>
          <span className="legend-item offers">Offres</span>
          <span className="legend-item applications">Candidatures</span>
        </div>
      </div>
      <div className="charts-grid">
        <div className="chart-card">
          <h4>Camembert</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: gridColor }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h4>Diagramme à barres</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: textColor }} />
              <YAxis tick={{ fill: textColor }} />
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: gridColor }} />
              <Bar dataKey="value" fill="#2563eb">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card full-width">
          <h4>Évolution mensuelle (simulée)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={[
              { mois: 'Jan', étudiants: 20, offres: 8 },
              { mois: 'Fév', étudiants: 28, offres: 12 },
              { mois: 'Mar', étudiants: 35, offres: 15 },
              { mois: 'Avr', étudiants: 42, offres: 22 },
              { mois: 'Mai', étudiants: 55, offres: 30 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="mois" tick={{ fill: textColor }} />
              <YAxis tick={{ fill: textColor }} />
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: gridColor }} />
              <Legend />
              <Line type="monotone" dataKey="étudiants" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="offres" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatisticsChart;
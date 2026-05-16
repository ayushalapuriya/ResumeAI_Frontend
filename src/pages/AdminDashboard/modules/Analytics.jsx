import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import adminService from '../../../services/adminService';
import toast from 'react-hot-toast';

const Analytics = () => {
  const { stats } = useOutletContext();
  const [groupBy, setGroupBy] = useState('day');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('cumulative'); // cumulative or daily

  useEffect(() => {
    fetchGrowthData();
  }, [groupBy]);

  const fetchGrowthData = async () => {
    setLoading(true);
    try {
      const growthData = await adminService.getGrowthStats(groupBy);
      setData(growthData);
    } catch (err) {
      console.error('Error loading growth data:', err);
      toast.error('Failed to load growth analytics');
    } finally {
      setLoading(false);
    }
  };

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(d => {
      let label = d.date;
      if (groupBy === 'day') {
        label = new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      } else if (groupBy === 'month') {
        const [year, month] = d.date.split('-');
        label = new Date(year, month - 1).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
      }
      
      return {
        ...d,
        label,
        displayUsers: chartType === 'cumulative' ? d.users : d.newUsers
      };
    });
  }, [data, groupBy, chartType]);

  const summaryStats = [
    { label: 'Total Users', value: stats?.totalUsers || 0, color: '#6366f1' },
    { label: 'New Users (Today)', value: stats?.newUsersToday || 0, color: '#22c55e' },
    { label: 'Growth (30d)', value: `${stats?.growthPercentage || 0}%`, color: '#f59e0b' }
  ];

  if (loading && data.length === 0) {
    return (
      <div className="analytics-skeleton">
        <div className="skeleton-grid">
          {[1, 2, 3].map(i => <div key={i} className="skeleton-card" style={{ height: '120px' }}></div>)}
        </div>
        <div className="skeleton-card" style={{ height: '400px', marginTop: '24px' }}></div>
      </div>
    );
  }

  return (
    <div className="admin-analytics">
      <div className="analytics-summary-grid">
        {summaryStats.map((stat, idx) => (
          <div key={idx} className="card stat-summary-card">
            <span className="stat-label">{stat.label}</span>
            <h3 style={{ color: stat.color }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="card analytics-main-card">
        <div className="analytics-header">
          <div className="header-info">
            <h4>User Growth Insights</h4>
            <p className="subtitle">Visualizing platform expansion over time</p>
          </div>
          <div className="analytics-controls">
            <div className="btn-group">
              <button 
                className={`btn-toggle ${chartType === 'cumulative' ? 'active' : ''}`}
                onClick={() => setChartType('cumulative')}
              >
                Cumulative
              </button>
              <button 
                className={`btn-toggle ${chartType === 'daily' ? 'active' : ''}`}
                onClick={() => setChartType('daily')}
              >
                New Users
              </button>
            </div>
            <select 
              value={groupBy} 
              onChange={(e) => setGroupBy(e.target.value)}
              className="group-select"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
        </div>

        {processedData.length > 0 ? (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              {chartType === 'cumulative' ? (
                <AreaChart data={processedData}>
                  <defs>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="label" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                      padding: '12px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="displayUsers" 
                    name="Total Users"
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorGrowth)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              ) : (
                <BarChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="label" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                      padding: '12px'
                    }} 
                  />
                  <Bar 
                    dataKey="displayUsers" 
                    name="New Users"
                    fill="#6366f1" 
                    radius={[4, 4, 0, 0]}
                    barSize={groupBy === 'month' ? 40 : 20}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p>No growth data available for this period.</p>
          </div>
        )}
      </div>

      <div className="analytics-details-grid">
        <div className="card">
          <h4>Role Distribution</h4>
          <div className="role-progress-list">
             {/* This could also be dynamic if I add an endpoint for it */}
             <div className="role-item">
               <div className="role-info"><span>Free Users</span><span>{stats?.totalUsers - stats?.premiumUsers || 0}</span></div>
               <div className="progress-bar"><div className="progress-fill" style={{width: `${((stats?.totalUsers - stats?.premiumUsers) / stats?.totalUsers * 100) || 0}%`}}></div></div>
             </div>
             <div className="role-item">
               <div className="role-info"><span>Premium Users</span><span>{stats?.premiumUsers || 0}</span></div>
               <div className="progress-bar"><div className="progress-fill premium" style={{width: `${(stats?.premiumUsers / stats?.totalUsers * 100) || 0}%`}}></div></div>
             </div>
          </div>
        </div>
        
        <div className="card">
          <h4>Growth Benchmarks</h4>
          <ul className="benchmark-list">
            <li>
              <span>Daily Target</span>
              <span className="badge active">Met</span>
            </li>
            <li>
              <span>Weekly Retention</span>
              <span className="badge active">84%</span>
            </li>
            <li>
              <span>Churn Rate</span>
              <span className="badge inactive">2.1%</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

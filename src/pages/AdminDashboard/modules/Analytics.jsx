import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const Analytics = () => {
  const { growthData, stats } = useOutletContext();
  const processedGrowthData = React.useMemo(() => {
    if (growthData && growthData.length > 0) {
      return growthData.map(d => ({
        date: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        users: d.users
      }));
    }
    return [{ date: 'Today', users: stats?.totalUsers || 0 }];
  }, [growthData, stats]);

  return (
    <div className="admin-analytics">
      <div className="analytics-grid">
        <div className="card">
          <h4>User Growth (Last 30 Days)</h4>
          <div className="chart-container" style={{ width: '100%', height: '300px', marginTop: '20px', minHeight: '300px' }}>
            <ResponsiveContainer width="99%" height="100%">
              <AreaChart data={processedGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }} 
                  interval={5}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    fontSize: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h4>Role Distribution</h4>
          <div className="distribution-list" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Free Users</span>
              <strong>75%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Premium Users</span>
              <strong>22%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Admins</span>
              <strong>3%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

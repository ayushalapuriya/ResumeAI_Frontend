import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="breadcrumbs" style={{ marginBottom: '16px', display: 'flex', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
      <Link to="/" style={{ color: '#6366f1', textDecoration: 'none' }}>Home</Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return (
          <React.Fragment key={to}>
            <span>/</span>
            {last ? (
              <span style={{ textTransform: 'capitalize' }}>{value}</span>
            ) : (
              <Link to={to} style={{ color: '#6366f1', textDecoration: 'none', textTransform: 'capitalize' }}>
                {value}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;

import React from 'react';
import UniversalTemplate from './UniversalTemplate';

/**
 * Standard Resume Data Structure
 * {
 *   personal: { fullName, email, phone, location, jobTitle, summary, website, linkedin },
 *   experience: [{ id, company, role, startDate, endDate, current, description }],
 *   education: [{ id, institution, degree, field, year }],
 *   skills: [string],
 *   projects: [{ id, name, role, url, description, startDate, endDate }]
 * }
 */

// ─── Template 1: Modern Minimalist ──────────────────────────────────────────
const ModernMinimalist = ({ data, accentColor }) => {
  return (
    <div style={{ padding: '40px', background: 'white', minHeight: '100%', color: '#1a1a2e', fontFamily: '"Inter", sans-serif' }}>
      <header style={{ borderBottom: `2px solid ${accentColor}`, paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>{data.fullName || 'Your Name'}</h1>
        <p style={{ fontSize: '1.1rem', color: accentColor, fontWeight: 600, marginTop: '5px' }}>{data.jobTitle || 'Job Title'}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '15px', fontSize: '0.85rem', color: '#64748b' }}>
          {data.email && <span>✉ {data.email}</span>}
          {data.phone && <span>📞 {data.phone}</span>}
          {data.location && <span>📍 {data.location}</span>}
          {data.website && <span>🔗 {data.website}</span>}
        </div>
      </header>

      {data.summary && (
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginBottom: '10px' }}>Professional Summary</h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#334155' }}>{data.summary}</p>
        </section>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        <div className="main-col">
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginBottom: '15px' }}>Experience</h2>
            {(data.experience || []).map((exp, i) => (
              <div key={exp.id || i} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{exp.role}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: accentColor, fontWeight: 600, marginBottom: '8px' }}>{exp.company}</div>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#475569', whiteSpace: 'pre-line' }}>{exp.description}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginBottom: '15px' }}>Projects</h2>
            {(data.projects || []).map((proj, i) => (
              <div key={proj.id || i} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{proj.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{proj.startDate}</span>
                </div>
                {proj.url && <div style={{ fontSize: '0.8rem', color: accentColor, marginBottom: '5px' }}>{proj.url}</div>}
                <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#475569' }}>{proj.description}</p>
              </div>
            ))}
          </section>
        </div>

        <div className="side-col">
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginBottom: '15px' }}>Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(data.skills || []).map((skill, i) => (
                <span key={i} style={{ padding: '4px 10px', background: '#f1f5f9', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 500, color: '#475569' }}>{skill}</span>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginBottom: '15px' }}>Education</h2>
            {(data.education || []).map((edu, i) => (
              <div key={edu.id || i} style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{edu.degree}</h3>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>{edu.institution}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{edu.year}</div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

// ─── Template 2: Creative Sidebar ───────────────────────────────────────────
const CreativeSidebar = ({ data, accentColor }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100%', background: 'white', color: '#334155', fontFamily: '"Poppins", sans-serif' }}>
      <aside style={{ width: '35%', background: '#1e293b', color: 'white', padding: '40px 25px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: accentColor, margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '2rem', fontWeight: 700 }}>
            {data.fullName?.charAt(0) || 'U'}
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>{data.fullName || 'Your Name'}</h1>
          <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '5px' }}>{data.jobTitle || 'Job Title'}</p>
        </div>

        <section style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: accentColor, borderBottom: `1px solid ${accentColor}44`, paddingBottom: '8px', marginBottom: '15px' }}>Contact</h3>
          <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.email && <div style={{ wordBreak: 'break-all' }}>✉ {data.email}</div>}
            {data.phone && <div>📞 {data.phone}</div>}
            {data.location && <div>📍 {data.location}</div>}
            {data.website && <div style={{ wordBreak: 'break-all' }}>🔗 {data.website}</div>}
          </div>
        </section>

        <section>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: accentColor, borderBottom: `1px solid ${accentColor}44`, paddingBottom: '8px', marginBottom: '15px' }}>Skills</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(data.skills || []).map((skill, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span>{skill}</span>
                </div>
                <div style={{ height: '4px', background: '#334155', borderRadius: '2px' }}>
                  <div style={{ width: '80%', height: '100%', background: accentColor, borderRadius: '2px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>

      <main style={{ flex: 1, padding: '40px', background: '#f8fafc' }}>
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span style={{ width: '30px', height: '2px', background: accentColor }}></span>
            About Me
          </h2>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#475569' }}>{data.summary}</p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
            <span style={{ width: '30px', height: '2px', background: accentColor }}></span>
            Experience
          </h2>
          {(data.experience || []).map((exp, i) => (
            <div key={exp.id || i} style={{ marginBottom: '25px', position: 'relative', paddingLeft: '20px', borderLeft: `2px solid ${accentColor}22` }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: accentColor, position: 'absolute', left: '-6px', top: '5px' }}></div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', margin: '0 0 5px' }}>{exp.role}</h3>
              <div style={{ fontSize: '0.85rem', color: accentColor, fontWeight: 600, marginBottom: '5px' }}>{exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#64748b' }}>{exp.description}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span style={{ width: '30px', height: '2px', background: accentColor }}></span>
            Education
          </h2>
          {(data.education || []).map((edu, i) => (
            <div key={edu.id || i} style={{ marginBottom: '15px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{edu.degree}</h3>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{edu.institution} | {edu.year}</div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export const TEMPLATE_REGISTRY = {
  1: ModernMinimalist,
  2: CreativeSidebar,
};

/**
 * getTemplateComponent
 * Returns a React component for the given template ID.
 * If the template has dynamic layout/css (from DB), it returns UniversalTemplate.
 */
export const getTemplateComponent = (id, templateData) => {
  // 1. If we have layout data from the database, USE IT (this is the "real" template)
  if (templateData && templateData.htmlLayout) {
    return (props) => <UniversalTemplate {...props} template={templateData} />;
  }

  // 2. Fallback: If we have a hardcoded component for this ID (legacy/demo)
  if (TEMPLATE_REGISTRY[id]) {
    return TEMPLATE_REGISTRY[id];
  }

  // 3. Absolute Fallback to default design
  return ModernMinimalist;
};

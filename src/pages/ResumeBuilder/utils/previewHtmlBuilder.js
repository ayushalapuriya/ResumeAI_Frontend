// ─────────────────────────────────────────────────────────────────────────────
// Preview HTML Generator
// Pure functions that transform ResumeData → raw HTML strings for the live
// preview pane.
// ─────────────────────────────────────────────────────────────────────────────

// ═════════════════════════════════════════════════════════════════════════════
// UNIVERSAL (fallback) template builders
// Used by buildUniversalPreviewHtml when no backend template is active.
// Classes are prefixed with "rv-" to avoid collision with template CSS.
// ═════════════════════════════════════════════════════════════════════════════

function buildExperienceHtml(data) {
  return (data.experience || [])
    .map(
      (exp) => `
      <div class="rv-entry">
        <div class="rv-entry-head">
          <div>
            <span class="rv-role">${exp.role || ''}</span>
            ${exp.company ? `<span class="rv-company"> · ${exp.company}</span>` : ''}
          </div>
          <span class="rv-dates">
            ${exp.startDate || ''}${exp.current ? ' – Present' : exp.endDate ? ' – ' + exp.endDate : ''}
          </span>
        </div>
        ${exp.description ? `<p class="rv-desc">${exp.description}</p>` : ''}
      </div>`
    )
    .join('');
}

function buildEducationHtml(data) {
  return (data.education || [])
    .map(
      (edu) => `
      <div class="rv-entry">
        <div class="rv-entry-head">
          <div>
            <span class="rv-role">${edu.degree || ''}${edu.field ? ', ' + edu.field : ''}</span>
            ${edu.institution ? `<span class="rv-company"> · ${edu.institution}</span>` : ''}
          </div>
          <span class="rv-dates">${edu.year || ''}</span>
        </div>
      </div>`
    )
    .join('');
}

function buildProjectsHtml(data) {
  return (data.projects || [])
    .map(
      (proj) => `
      <div class="rv-entry">
        <div class="rv-entry-head">
          <div>
            <span class="rv-role">${proj.name || ''}</span>
            ${proj.role ? `<span class="rv-company"> · ${proj.role}</span>` : ''}
          </div>
          <span class="rv-dates">${proj.startDate || ''}${proj.endDate ? ' – ' + proj.endDate : ''}</span>
        </div>
        ${proj.url ? `<p class="rv-link">${proj.url}</p>` : ''}
        ${proj.description ? `<p class="rv-desc">${proj.description}</p>` : ''}
      </div>`
    )
    .join('');
}

function buildSkillsHtml(data) {
  return (data.skills || []).map((s) => `<span class="rv-skill">${s}</span>`).join('');
}

// ── Universal styles ──────────────────────────────────────────────────────────

function buildPreviewStyles(accentColor) {
  return `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .rv-wrap { background: #fff; }
      .rv-header { background: ${accentColor}; padding: 22px 26px; color: #fff; }
      .rv-name  { font-size: 1.5rem; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 3px; }
      .rv-title { font-size: 0.82rem; opacity: 0.88; font-weight: 500; margin-bottom: 12px; }
      .rv-contact-row { display: flex; flex-wrap: wrap; gap: 6px 14px; }
      .rv-contact-item { font-size: 0.7rem; opacity: 0.82; display: flex; align-items: center; gap: 4px; }
      .rv-body  { padding: 20px 26px; }
      .rv-section { margin-bottom: 18px; }
      .rv-sec-label {
        font-size: 0.6rem; font-weight: 900; letter-spacing: 1.8px;
        text-transform: uppercase; color: ${accentColor};
        border-bottom: 1.5px solid ${accentColor}44;
        padding-bottom: 5px; margin-bottom: 10px;
      }
      .rv-summary { font-size: 0.78rem; color: #555; line-height: 1.65; }
      .rv-entry  { margin-bottom: 12px; }
      .rv-entry-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
      .rv-role    { font-size: 0.82rem; font-weight: 700; color: #1a1a2e; }
      .rv-company { font-size: 0.78rem; color: #64748b; }
      .rv-dates   { font-size: 0.7rem;  color: #94a3b8; white-space: nowrap; }
      .rv-desc    { font-size: 0.74rem; color: #555; line-height: 1.6; }
      .rv-link    { font-size: 0.7rem;  color: ${accentColor}; margin-bottom: 3px; }
      .rv-skills-wrap { display: flex; flex-wrap: wrap; gap: 5px; }
      .rv-skill {
        padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 600;
        background: ${accentColor}12; border: 1px solid ${accentColor}30; color: ${accentColor};
      }
    </style>`;
}

// ═════════════════════════════════════════════════════════════════════════════
// TEMPLATE-SPECIFIC section builders
// These emit HTML whose class names match exactly the CSS classes defined in
// each backend template's cssStyles string.
// ═════════════════════════════════════════════════════════════════════════════

function buildTemplateContactHtml(data) {
  const emailSvg    = `<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;
  const phoneSvg    = `<svg viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>`;
  const locationSvg = `<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
  const websiteSvg  = `<svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.91-4.33-3.56zm2.95-8H5.08c.96-1.65 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>`;

  const items = [];
  if (data.email)    items.push({ svg: emailSvg,    text: data.email });
  if (data.phone)    items.push({ svg: phoneSvg,    text: data.phone });
  if (data.location) items.push({ svg: locationSvg, text: data.location });
  if (data.website)  items.push({ svg: websiteSvg,  text: data.website });

  if (!items.length) return '';

  return items
    .map(
      ({ svg, text }) => `
      <div class="s-contact-item">
        <div class="s-contact-icon">${svg}</div>
        <span class="s-contact-text">${text}</span>
      </div>`
    )
    .join('');
}

function buildTemplateExperienceHtml(data) {
  if (!data.experience || !data.experience.length) {
    return '<p class="empty-section">No experience added yet.</p>';
  }

  return data.experience
    .map(
      (exp, index) => `
      <div class="exp-item">
        <div class="exp-dot-col">
          <div class="exp-dot"></div>
          ${index < data.experience.length - 1 ? '<div class="exp-line"></div>' : ''}
        </div>
        <div class="exp-content">
          <div class="exp-meta">
            <div>
              <div class="exp-role">${exp.role || ''}</div>
              ${exp.company ? `<div class="exp-company">${exp.company}</div>` : ''}
            </div>
            <span class="exp-date">
              ${exp.startDate || ''}${exp.current ? ' – Present' : exp.endDate ? ' – ' + exp.endDate : ''}
            </span>
          </div>
          ${exp.description ? `<div class="exp-desc">${exp.description}</div>` : ''}
        </div>
      </div>`
    )
    .join('');
}

function buildTemplateEducationHtml(data) {
  if (!data.education || !data.education.length) {
    return '<p class="empty-section">No education added yet.</p>';
  }

  return data.education
    .map(
      (edu) => `
      <div class="edu-item">
        <div>
          <div class="edu-degree">${edu.degree || ''}</div>
          ${edu.field ? `<div class="edu-field">${edu.field}</div>` : ''}
          ${edu.institution ? `<div class="edu-inst">${edu.institution}</div>` : ''}
        </div>
        <div class="edu-right">
          <div class="edu-dates">${edu.year || ''}</div>
        </div>
      </div>`
    )
    .join('');
}

function buildTemplateProjectsHtml(data) {
  if (!data.projects || !data.projects.length) {
    return '<p class="empty-section">No projects added yet.</p>';
  }

  return data.projects
    .map(
      (proj) => `
      <div class="proj-card">
        <div class="proj-top">
          <span class="proj-name">${proj.name || ''}</span>
          ${proj.url ? `<span class="proj-url">${proj.url}</span>` : ''}
        </div>
        ${proj.role ? `<div class="proj-role">${proj.role}</div>` : ''}
        ${proj.description ? `<div class="proj-desc">${proj.description}</div>` : ''}
        ${(proj.startDate || proj.endDate) ? `
        <div class="proj-techs">
          <span class="tech-pill">${proj.startDate || ''}${proj.endDate ? ' – ' + proj.endDate : ''}</span>
        </div>` : ''}
      </div>`
    )
    .join('');
}

function buildTemplateSkillsHtml(data) {
  if (!data.skills || !data.skills.length) {
    return '<p class="empty-section">No skills added yet.</p>';
  }

  const widths = [92, 85, 78, 88, 72, 95, 80, 68, 90, 75];

  return data.skills
    .map((skill, i) => {
      const pct = widths[i % widths.length];
      return `
      <div class="skill-bar-wrap">
        <div class="skill-bar-label">
          <span>${skill}</span>
        </div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>`;
    })
    .join('');
}

// ═════════════════════════════════════════════════════════════════════════════
// Public API
// ═════════════════════════════════════════════════════════════════════════════

export function buildUniversalPreviewHtml(data, accentColor) {
  const exp    = buildExperienceHtml(data);
  const edu    = buildEducationHtml(data);
  const proj   = buildProjectsHtml(data);
  const skills = buildSkillsHtml(data);

  return `
    ${buildPreviewStyles(accentColor)}
    <div class="rv-wrap">
      <div class="rv-header">
        <div class="rv-name">${data.fullName || 'Your Name'}</div>
        <div class="rv-title">${data.jobTitle || 'Job Title'}</div>
        <div class="rv-contact-row">
          ${data.email    ? `<span class="rv-contact-item">✉ ${data.email}</span>`      : ''}
          ${data.phone    ? `<span class="rv-contact-item">📞 ${data.phone}</span>`     : ''}
          ${data.location ? `<span class="rv-contact-item">📍 ${data.location}</span>` : ''}
          ${data.website  ? `<span class="rv-contact-item">🔗 ${data.website}</span>`  : ''}
        </div>
      </div>
      <div class="rv-body">
        ${data.summary ? `<div class="rv-section"><div class="rv-sec-label">Summary</div><p class="rv-summary">${data.summary}</p></div>` : ''}
        ${(data.experience && data.experience.length) ? `<div class="rv-section"><div class="rv-sec-label">Experience</div>${exp}</div>`   : ''}
        ${(data.education && data.education.length)  ? `<div class="rv-section"><div class="rv-sec-label">Education</div>${edu}</div>`   : ''}
        ${(data.projects && data.projects.length)   ? `<div class="rv-section"><div class="rv-sec-label">Projects</div>${proj}</div>`   : ''}
        ${(data.skills && data.skills.length)     ? `<div class="rv-section"><div class="rv-sec-label">Skills</div><div class="rv-skills-wrap">${skills}</div></div>` : ''}
      </div>
    </div>`;
}

export function buildTemplatePreviewHtml(htmlLayout, cssStyles, data) {
  const injected = (htmlLayout || '')
    .replace(/\{\{FULL_NAME\}\}/g, data.fullName || 'Your Name')
    .replace(/\{\{JOB_TITLE\}\}/g, data.jobTitle || 'Job Title')
    .replace(/\{\{EMAIL\}\}/g,     data.email    || '')
    .replace(/\{\{PHONE\}\}/g,     data.phone    || '')
    .replace(/\{\{LOCATION\}\}/g,  data.location || '')
    .replace(/\{\{WEBSITE\}\}/g,   data.website  || '')
    .replace(/\{\{SUMMARY\}\}/g,   data.summary  || '')
    .replace(/\{\{CONTACT\}\}/g,    buildTemplateContactHtml(data))
    .replace(/\{\{EXPERIENCE\}\}/g, buildTemplateExperienceHtml(data))
    .replace(/\{\{EDUCATION\}\}/g,  buildTemplateEducationHtml(data))
    .replace(/\{\{PROJECTS\}\}/g,   buildTemplateProjectsHtml(data))
    .replace(/\{\{SKILLS\}\}/g,     buildTemplateSkillsHtml(data));

  return `<style>${cssStyles || ''} body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }</style>${injected}`;
}

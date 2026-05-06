// ─────────────────────────────────────────────────────────────────────────────
// Default / seed data for new resumes
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_RESUME_DATA = {
  fullName: 'Alex Johnson',
  jobTitle: 'Senior Product Designer',
  email: 'alex@example.com',
  phone: '9876543210',
  location: 'San Francisco, CA',
  website: 'alexjohnson.io',
  linkedin: '',
  summary:
    'Creative product designer with 6+ years of experience crafting user-centered digital experiences. Passionate about bridging business goals with elegant design solutions.',
  experience: [
    {
      id: 1,
      company: 'Acme Corp',
      role: 'Senior Product Designer',
      startDate: 'Jan 2022',
      endDate: '',
      current: true,
      description:
        'Led end-to-end design for mobile and web products, collaborating with engineers and PMs to ship features used by 2M+ users.',
    },
    {
      id: 2,
      company: 'Startup Inc',
      role: 'UX Designer',
      startDate: 'Mar 2019',
      endDate: 'Dec 2021',
      current: false,
      description: 'Designed onboarding flows and core dashboard, reducing churn by 18%.',
    },
  ],
  education: [
    {
      id: 1,
      institution: 'University of California',
      degree: 'B.Sc.',
      field: 'Computer Science',
      year: '2018',
    },
  ],
  projects: [
    {
      id: 1,
      name: 'DesignOS',
      role: 'Lead Designer',
      url: 'github.com/alex/designos',
      startDate: '2023',
      endDate: '2024',
      description:
        'Open-source design system used by 500+ teams. Built component library in React + Figma.',
    },
  ],
  skills: ['Figma', 'Product Strategy', 'User Research', 'Prototyping', 'Design Systems', 'React'],
};

export const BUILDER_SECTIONS = [
  { id: 'personal',   label: 'Personal Info', icon: 'person' },
  { id: 'summary',    label: 'Summary',       icon: 'notes'  },
  { id: 'experience', label: 'Experience',    icon: 'work'   },
  { id: 'education',  label: 'Education',     icon: 'school' },
  { id: 'projects',   label: 'Projects',      icon: 'code'   },
  { id: 'skills',     label: 'Skills',        icon: 'bolt'   },
];

export const TEMPLATE_ACCENT_PALETTE = {
  1: '#6366f1',
  2: '#0f172a',
  3: '#64748b',
  4: '#ec4899',
  5: '#0ea5e9',
  6: '#1e293b',
  7: '#8b5cf6',
  8: '#b45309',
};

import React from 'react';
import { Link } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'Perfect for getting started',
      features: [
        '3 Resumes',
        'Free Templates',
        '5 AI Generations / month',
        'ATS Checker (3/month)',
        'PDF Export'
      ],
      cta: 'Start for Free',
      link: '/signup',
      highlight: false
    },
    {
      name: 'Premium',
      price: '12',
      description: 'For serious job seekers',
      features: [
        'Unlimited Resumes',
        'All Premium Templates',
        'Unlimited AI Generation',
        'AI Cover Letter Generator',
        'AI Resume Tailoring',
        'Advanced Exports (DOCX, JSON)',
        'Job Matching System'
      ],
      cta: 'Get Premium',
      link: '/signup?plan=premium',
      highlight: true
    },
    {
      name: 'Admin',
      price: 'Contact',
      description: 'For platform management',
      features: [
        'User Management',
        'Template Management',
        'Platform Analytics',
        'AI Monitoring',
        'Audit Logs'
      ],
      cta: 'Contact Sales',
      link: '/contact',
      highlight: false
    }
  ];

  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1>Simple, Transparent Pricing</h1>
        <p>Choose the plan that's right for your career growth</p>
      </div>

      <div className="plans-container">
        {plans.map((plan, i) => (
          <div className={`plan-card ${plan.highlight ? 'highlight' : ''}`} key={i}>
            {plan.highlight && <div className="popular-tag">MOST POPULAR</div>}
            <div className="plan-name">{plan.name}</div>
            <div className="plan-price">
              <span className="currency">$</span>
              <span className="amount">{plan.price}</span>
              {plan.price !== 'Contact' && <span className="period">/month</span>}
            </div>
            <p className="plan-desc">{plan.description}</p>
            
            <ul className="plan-features">
              {plan.features.map((feature, j) => (
                <li key={j}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Link to={plan.link} className={`btn-cta ${plan.highlight ? 'primary' : 'outline'}`}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;

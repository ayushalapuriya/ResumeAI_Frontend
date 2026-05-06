import React from 'react';
import PersonalInfoForm from './forms/PersonalInfoForm';
import SummaryForm from './forms/SummaryForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import ProjectsForm from './forms/ProjectsForm';
import SkillsForm from './forms/SkillsForm';

const FormPanel = ({ 
  resume, 
  activeSection, 
  accentColor, 
  onUpdate,
  onAddExperience,
  onRemoveExperience,
  onAddEducation,
  onRemoveEducation,
  onAddProject,
  onRemoveProject,
  onAddSkill,
  onRemoveSkill
}) => {
  return (
    <div className="form-panel">
      <div className="form-scroll">
        {activeSection === 'personal' && (
          <PersonalInfoForm 
            resume={resume} 
            accentColor={accentColor} 
            onUpdate={onUpdate}
          />
        )}

        {activeSection === 'summary' && (
          <SummaryForm 
            resume={resume} 
            accentColor={accentColor} 
            onUpdate={onUpdate}
          />
        )}

        {activeSection === 'experience' && (
          <ExperienceForm 
            items={resume.experience || []} 
            accentColor={accentColor} 
            onAddItem={onAddExperience}
            onRemoveItem={onRemoveExperience}
            onUpdateItem={onUpdate}
          />
        )}

        {activeSection === 'education' && (
          <EducationForm 
            items={resume.education || []} 
            accentColor={accentColor} 
            onAddItem={onAddEducation}
            onRemoveItem={onRemoveEducation}
            onUpdateItem={onUpdate}
          />
        )}

        {activeSection === 'projects' && (
          <ProjectsForm 
            items={resume.projects || []} 
            accentColor={accentColor} 
            onAddItem={onAddProject}
            onRemoveItem={onRemoveProject}
            onUpdateItem={onUpdate}
          />
        )}

        {activeSection === 'skills' && (
          <SkillsForm 
            skills={resume.skills || []} 
            accentColor={accentColor} 
            onAddSkill={onAddSkill}
            onRemoveSkill={onRemoveSkill}
          />
        )}
      </div>
    </div>
  );
};

export default FormPanel;

import React, { useState } from 'react';
import { Plus, Trash2, Wand2, Loader2 } from 'lucide-react';
import { enhanceBullets, generateSummary } from '../lib/aiApi';

const ResumeForm = ({ data, updateData, addItem, removeItem }) => {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [enhancingExpId, setEnhancingExpId] = useState(null);

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const summary = await generateSummary(data);
      updateData('personal', 'summary', summary);
    } catch (error) {
      console.error('Full summary generation error:', error);
      alert(`Failed to generate summary: ${error.message || 'Unknown error'}. Check console for details.`);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleEnhanceBullets = async (expId, description) => {
    if (!description || description.trim() === '') return;
    setEnhancingExpId(expId);
    try {
      const enhancedText = await enhanceBullets(description);
      updateData('experience', 'description', enhancedText, expId);
    } catch (error) {
      console.error('Full bullet enhancement error:', error);
      alert(`Failed to enhance bullets: ${error.message || 'Unknown error'}. Check console for details.`);
    } finally {
      setEnhancingExpId(null);
    }
  };
  const handleChange = (section, field, e, id = null) => {
    updateData(section, field, e.target.value, id);
  };

  const handleAddExperience = () => {
    addItem('experience', { company: '', position: '', startDate: '', endDate: '', description: '' });
  };

  const handleAddEducation = () => {
    addItem('education', { school: '', degree: '', startDate: '', endDate: '', description: '' });
  };

  const handleAddCertificate = () => {
    addItem('certificates', { name: '', issuer: '', date: '' });
  };

  return (
    <div className="resume-form">
      {/* Personal Details */}
      <h2 className="section-title">Personal Details</h2>
      <div className="form-group">
        <label>Full Name</label>
        <input type="text" value={data.personal.fullName} onChange={(e) => handleChange('personal', 'fullName', e)} placeholder="e.g. John Doe" />
      </div>
      <div className="form-group">
        <label>Job Title</label>
        <input type="text" value={data.personal.jobTitle} onChange={(e) => handleChange('personal', 'jobTitle', e)} placeholder="e.g. Software Engineer" />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={data.personal.email} onChange={(e) => handleChange('personal', 'email', e)} placeholder="e.g. john@example.com" />
      </div>
      <div className="form-group">
        <label>Phone</label>
        <input type="text" value={data.personal.phone} onChange={(e) => handleChange('personal', 'phone', e)} placeholder="e.g. +1 234 567 8900" />
      </div>
      <div className="form-group">
        <label>Location</label>
        <input type="text" value={data.personal.location} onChange={(e) => handleChange('personal', 'location', e)} placeholder="e.g. New York, USA" />
      </div>
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label style={{ marginBottom: 0 }}>Professional Summary</label>
          <button 
            type="button" 
            onClick={handleGenerateSummary} 
            disabled={isGeneratingSummary}
            className="btn btn-ai"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            {isGeneratingSummary ? <Loader2 size={14} className="spin" /> : <Wand2 size={14} />}
            Auto-Generate AI Summary
          </button>
        </div>
        <textarea 
          value={data.personal.summary} 
          onChange={(e) => handleChange('personal', 'summary', e)} 
          placeholder="Brief summary of your professional background..."
          disabled={isGeneratingSummary}
        ></textarea>
      </div>

      {/* Experience */}
      <h2 className="section-title">Work Experience</h2>
      {data.experience.map((exp, index) => (
        <div key={exp.id} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Experience #{index + 1}</h3>
            <button onClick={() => removeItem('experience', exp.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
              <Trash2 size={16} />
            </button>
          </div>
          <div className="form-group">
            <label>Company</label>
            <input type="text" value={exp.company} onChange={(e) => handleChange('experience', 'company', e, exp.id)} />
          </div>
          <div className="form-group">
            <label>Position</label>
            <input type="text" value={exp.position} onChange={(e) => handleChange('experience', 'position', e, exp.id)} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Start Date</label>
              <input type="text" value={exp.startDate} onChange={(e) => handleChange('experience', 'startDate', e, exp.id)} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>End Date</label>
              <input type="text" value={exp.endDate} onChange={(e) => handleChange('experience', 'endDate', e, exp.id)} />
            </div>
          </div>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ marginBottom: 0 }}>Description</label>
              <button 
                type="button" 
                onClick={() => handleEnhanceBullets(exp.id, exp.description)} 
                disabled={enhancingExpId === exp.id || !exp.description}
                className="btn btn-ai"
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                {enhancingExpId === exp.id ? <Loader2 size={14} className="spin" /> : <Wand2 size={14} />}
                Enhance with AI
              </button>
            </div>
            <textarea 
              value={exp.description} 
              onChange={(e) => handleChange('experience', 'description', e, exp.id)}
              disabled={enhancingExpId === exp.id}
            ></textarea>
          </div>
        </div>
      ))}
      <button className="btn btn-outline" onClick={handleAddExperience} style={{ width: '100%', marginBottom: '1rem' }}>
        <Plus size={16} /> Add Experience
      </button>

      {/* Education */}
      <h2 className="section-title">Education</h2>
      {data.education.map((edu, index) => (
        <div key={edu.id} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Education #{index + 1}</h3>
            <button onClick={() => removeItem('education', edu.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
              <Trash2 size={16} />
            </button>
          </div>
          <div className="form-group">
            <label>School/University</label>
            <input type="text" value={edu.school} onChange={(e) => handleChange('education', 'school', e, edu.id)} />
          </div>
          <div className="form-group">
            <label>Degree</label>
            <input type="text" value={edu.degree} onChange={(e) => handleChange('education', 'degree', e, edu.id)} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Start Date</label>
              <input type="text" value={edu.startDate} onChange={(e) => handleChange('education', 'startDate', e, edu.id)} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>End Date</label>
              <input type="text" value={edu.endDate} onChange={(e) => handleChange('education', 'endDate', e, edu.id)} />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={edu.description} onChange={(e) => handleChange('education', 'description', e, edu.id)}></textarea>
          </div>
        </div>
      ))}
      <button className="btn btn-outline" onClick={handleAddEducation} style={{ width: '100%', marginBottom: '1rem' }}>
        <Plus size={16} /> Add Education
      </button>

      {/* Certificates */}
      <h2 className="section-title">Certificates</h2>
      {data.certificates && data.certificates.map((cert, index) => (
        <div key={cert.id} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Certificate #{index + 1}</h3>
            <button onClick={() => removeItem('certificates', cert.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
              <Trash2 size={16} />
            </button>
          </div>
          <div className="form-group">
            <label>Certificate Name</label>
            <input type="text" value={cert.name} onChange={(e) => handleChange('certificates', 'name', e, cert.id)} placeholder="e.g. AWS Solutions Architect" />
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Issuer / Organization</label>
              <input type="text" value={cert.issuer} onChange={(e) => handleChange('certificates', 'issuer', e, cert.id)} placeholder="e.g. Amazon Web Services" />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Year / Date</label>
              <input type="text" value={cert.date} onChange={(e) => handleChange('certificates', 'date', e, cert.id)} placeholder="e.g. 2023" />
            </div>
          </div>
        </div>
      ))}
      <button className="btn btn-outline" onClick={handleAddCertificate} style={{ width: '100%', marginBottom: '1rem' }}>
        <Plus size={16} /> Add Certificate
      </button>

      {/* Skills */}
      <h2 className="section-title">Skills</h2>
      <div className="form-group" style={{ marginBottom: '2rem' }}>
        <label>Skills (Comma separated)</label>
        <textarea value={data.skills} onChange={(e) => updateData('skills', null, e.target.value)} placeholder="e.g. JavaScript, React, CSS, HTML"></textarea>
      </div>
    </div>
  );
};

export default ResumeForm;

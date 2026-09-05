import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ResumePreview = ({ data, template }) => {
  const { personal, experience, education, certificates = [], skills } = data;
  const skillsList = typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(s => s) : [];

  if (template === 'plain') {
    return (
      <div className="resume-paper template-plain">
        <h1>{personal.fullName || 'YOUR NAME'}</h1>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>{personal.jobTitle}</div>
        <div className="contact-info">
          {personal.email} | {personal.phone} | {personal.location}
        </div>
        
        {personal.summary && (
          <div style={{ marginBottom: '20px' }}>
            <p>{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <h2>Experience</h2>
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '15px' }}>
                <div className="date-location">{exp.startDate} - {exp.endDate}</div>
                <h3>{exp.position}</h3>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{exp.company}</div>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2>Education</h2>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '15px' }}>
                <div className="date-location">{edu.startDate} - {edu.endDate}</div>
                <h3>{edu.degree}</h3>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{edu.school}</div>
                <p>{edu.description}</p>
              </div>
            ))}
          </div>
        )}

        {certificates && certificates.length > 0 && (
          <div>
            <h2>Certificates</h2>
            {certificates.map(cert => (
              <div key={cert.id} style={{ marginBottom: '10px' }}>
                <div className="date-location">{cert.date}</div>
                <h3>{cert.name}</h3>
                <div style={{ fontWeight: 'normal', color: '#555' }}>{cert.issuer}</div>
              </div>
            ))}
          </div>
        )}

        {skillsList.length > 0 && (
          <div>
            <h2>Skills</h2>
            <p>{skillsList.join(', ')}</p>
          </div>
        )}
      </div>
    );
  }

  // Attractive Template
  return (
    <div className="resume-paper template-attractive">
      <div className="left-col">
        <h1>{personal.fullName || 'YOUR NAME'}</h1>
        <div className="title">{personal.jobTitle}</div>
        
        <h2>Contact</h2>
        <div className="contact-item">
          <i><Mail size={16} /></i>
          <span>{personal.email}</span>
        </div>
        <div className="contact-item">
          <i><Phone size={16} /></i>
          <span>{personal.phone}</span>
        </div>
        <div className="contact-item">
          <i><MapPin size={16} /></i>
          <span>{personal.location}</span>
        </div>

        <div style={{ marginTop: '40px' }}>
          <h2>Skills</h2>
          <div>
            {skillsList.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="right-col">
        {personal.summary && (
          <div style={{ marginBottom: '30px' }}>
            <h2>Profile</h2>
            <p>{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2>Experience</h2>
            {experience.map(exp => (
              <div key={exp.id} className="experience-item">
                <h3>{exp.position}</h3>
                <div className="company">{exp.company}</div>
                <div className="date">{exp.startDate} - {exp.endDate}</div>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2>Education</h2>
            {education.map(edu => (
              <div key={edu.id} className="experience-item">
                <h3>{edu.degree}</h3>
                <div className="company">{edu.school}</div>
                <div className="date">{edu.startDate} - {edu.endDate}</div>
                <p>{edu.description}</p>
              </div>
            ))}
          </div>
        )}

        {certificates && certificates.length > 0 && (
          <div>
            <h2>Certificates</h2>
            {certificates.map(cert => (
              <div key={cert.id} className="experience-item" style={{ marginBottom: '15px' }}>
                <h3 style={{ marginBottom: '2px' }}>{cert.name}</h3>
                <div className="company">{cert.issuer} <span style={{ fontWeight: 'normal', color: '#9ca3af', marginLeft: '5px' }}>({cert.date})</span></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;

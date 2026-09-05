import React, { useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { Download, LayoutTemplate, Settings2, LogOut, Save, LayoutDashboard } from 'lucide-react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import { supabase } from './supabase';
import './index.css';

function App() {
  const [template, setTemplate] = useState('attractive'); // 'plain' or 'attractive'
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: 'John Doe',
      jobTitle: 'Software Engineer',
      email: 'john.doe@example.com',
      phone: '+1 234 567 8900',
      location: 'New York, USA',
      summary: 'Passionate and results-driven software engineer with over 5 years of experience building scalable web applications. Proficient in React, Node.js, and cloud technologies.',
    },
    experience: [
      {
        id: 1,
        company: 'Tech Solutions Inc.',
        position: 'Senior Developer',
        startDate: 'Jan 2020',
        endDate: 'Present',
        description: 'Led the frontend team to rebuild the core SaaS platform, improving performance by 40%. Mentored junior developers and implemented CI/CD pipelines.',
      }
    ],
    education: [
      {
        id: 1,
        school: 'State University',
        degree: 'B.S. Computer Science',
        startDate: 'Sep 2014',
        endDate: 'May 2018',
        description: 'Graduated with Honors. President of the Computer Science Club.',
      }
    ],
    certificates: [
      {
        id: 1,
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023',
      }
    ],
    skills: 'JavaScript, React, Node.js, TypeScript, SQL, Git, AWS'
  });

  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [view, setView] = useState('editor'); // 'editor' or 'dashboard'
  const [isSaving, setIsSaving] = useState(false);
  const resumeRef = useRef();
  const containerRef = useRef();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        // A4 width in pixels is roughly 794px
        const containerWidth = containerRef.current.clientWidth;
        // padding left and right is about 64px total (2rem each)
        const availableWidth = containerWidth - 64;
        
        if (availableWidth < 794) {
          setScale(availableWidth / 794);
        } else {
          setScale(1);
        }
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleDownloadPdf = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const element = resumeRef.current;
    const opt = {
      margin: 0,
      filename: `${resumeData.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleSaveResume = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    setIsSaving(true);
    try {
      // 1. Generate PDF Blob
      const element = resumeRef.current;
      const opt = {
        margin: 0,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
      
      // 2. Upload to Supabase Storage
      const fileName = `${user.id}/${Date.now()}_resume.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes-pdfs')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
        });
        
      if (uploadError) throw uploadError;
      
      // 3. Get Public URL
      const { data: urlData } = supabase.storage
        .from('resumes-pdfs')
        .getPublicUrl(fileName);
        
      // 4. Save to Database
      const title = resumeData.personal.fullName ? `${resumeData.personal.fullName}'s Resume` : 'My Resume';
      const { error: dbError } = await supabase.from('resumes').insert({
        user_id: user.id,
        title,
        data: resumeData,
        template,
        pdf_url: urlData.publicUrl
      });
      
      if (dbError) throw dbError;
      alert('Resume and PDF saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving resume. Please check the console.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateData = (section, field, value, id = null) => {
    setResumeData(prev => {
      if (Array.isArray(prev[section])) {
        return {
          ...prev,
          [section]: prev[section].map(item => 
            item.id === id ? { ...item, [field]: value } : item
          )
        };
      } else if (typeof prev[section] === 'object' && prev[section] !== null) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      } else {
        return {
          ...prev,
          [section]: value
        };
      }
    });
  };

  const addItem = (section, item) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], { ...item, id: Date.now() }]
    }));
  };

  const removeItem = (section, id) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  return (
    <div className="app-container">
      {view === 'editor' && (
        <div className="sidebar">
          <div className="sidebar-header">
            <h1><Settings2 size={24} /> ResumeCraft</h1>
          </div>
          <div className="sidebar-content">
            <div className="template-selection-box">
              <h3><LayoutTemplate size={16} className="inline-block mr-1" /> Select Template</h3>
              <div className="flex gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className={`btn ${template === 'plain' ? 'btn-outline active' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => setTemplate('plain')}
                >
                  Plain
                </button>
                <button 
                  className={`btn ${template === 'attractive' ? 'btn-outline active' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => setTemplate('attractive')}
                >
                  Attractive
                </button>
              </div>
            </div>

            <ResumeForm 
              data={resumeData} 
              updateData={updateData} 
              addItem={addItem}
              removeItem={removeItem}
            />
          </div>
        </div>
      )}

      {/* Main Content & Preview */}
      <div className="main-content">
        <div className="toolbar" style={{ justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <button 
              className={`btn ${view === 'editor' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setView('editor')}
              style={{ marginRight: '0.5rem' }}
            >
              <Settings2 size={18} /> Editor
            </button>
            <button 
              className={`btn ${view === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => {
                if (!user) setShowAuthModal(true);
                else setView('dashboard');
              }}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight: '1rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                  {user.email}
                </span>
                <button 
                  className="btn btn-outline" 
                  onClick={() => { supabase.auth.signOut(); setView('editor'); }}
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : null}
            {view === 'editor' && (
              <>
                <button className="btn btn-outline" onClick={handleSaveResume} disabled={isSaving}>
                  <Save size={18} />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button className="btn btn-primary" onClick={handleDownloadPdf}>
                  <Download size={18} />
                  Download PDF
                </button>
              </>
            )}
          </div>
        </div>
        
        {view === 'dashboard' ? (
          <div style={{ flex: 1, overflow: 'auto', backgroundColor: 'var(--bg-color)' }}>
            <Dashboard 
              user={user} 
              onLoadResume={(data, tmpl) => {
                setResumeData(data);
                setTemplate(tmpl);
                setView('editor');
              }} 
            />
          </div>
        ) : (
          <div className="preview-container" ref={containerRef}>
            <div className="resume-wrapper" style={{ transform: `scale(${scale})`, marginBottom: scale < 1 ? `-${(1 - scale) * 297}mm` : '0' }}>
              <div ref={resumeRef}>
                <ResumePreview data={resumeData} template={template} />
              </div>
            </div>
          </div>
        )}
      </div>

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={() => setShowAuthModal(false)} 
        />
      )}
    </div>
  );
}

export default App;

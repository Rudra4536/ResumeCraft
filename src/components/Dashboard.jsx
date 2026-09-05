import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { FileText, Trash2, Edit, DownloadCloud } from 'lucide-react';

const Dashboard = ({ user, onLoadResume }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, [user]);

  const fetchResumes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setResumes(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('resumes').delete().eq('id', id);
    if (!error) {
      setResumes(resumes.filter(r => r.id !== id));
    }
  };

  if (loading) return <div className="p-8 text-center">Loading resumes...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>My Saved Resumes</h2>
      
      {resumes.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: '3rem', backgroundColor: 'var(--white)', borderRadius: '0.5rem' }}>
          You haven't saved any resumes yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {resumes.map(resume => (
            <div key={resume.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--white)', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--light-blue)', color: 'var(--primary-blue)', borderRadius: '0.5rem' }}>
                  <FileText size={24} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-dark)' }}>{resume.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                    Template: {resume.template} • Saved: {new Date(resume.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {resume.pdf_url && (
                  <a href={resume.pdf_url} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ textDecoration: 'none' }}>
                    <DownloadCloud size={16} /> PDF
                  </a>
                )}
                <button className="btn btn-outline" onClick={() => onLoadResume(resume.data, resume.template)}>
                  <Edit size={16} /> Load
                </button>
                <button className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#fee2e2' }} onClick={() => handleDelete(resume.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

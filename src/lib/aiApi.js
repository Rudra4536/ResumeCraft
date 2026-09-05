const API_URL = 'http://localhost:3001/api/generate-ai';

export const enhanceBullets = async (description) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'enhance_bullets', payload: { description } }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error('Error enhancing bullets:', data.error);
    throw new Error(data.error || 'Failed to enhance bullets');
  }

  return data.result;
};

export const generateSummary = async (resumeData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'generate_summary',
      payload: {
        skills: resumeData.skills,
        education: resumeData.education,
        experience: resumeData.experience,
      }
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error('Error generating summary:', data.error);
    throw new Error(data.error || 'Failed to generate summary');
  }

  return data.result;
};

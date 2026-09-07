import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.post('/api/generate-ai', async (req, res) => {
  try {
    const { action, payload } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not set in backend server.' });
    }

    let prompt = '';

    if (action === 'enhance_bullets') {
      const { description } = payload;
      prompt = `You are an expert resume writer. Take the following work experience description and rewrite it into 3-4 professional, impactful, and ATS-optimized bullet points using strong action verbs. Return ONLY the bullet points, starting each with a dash (-), no introductory text.\n\nDescription:\n${description}`;
    } else if (action === 'generate_summary') {
      const { skills, education, experience } = payload;
      prompt = `You are an expert resume writer. Generate a highly professional 3-sentence summary for a resume based on the following details. Highlight the person's key skills, most relevant experience, and core strengths. Return ONLY the 3-sentence summary, no introductory text.\n\nSkills: ${skills}\nEducation: ${JSON.stringify(education)}\nExperience: ${JSON.stringify(experience)}`;
    } else {
      return res.status(400).json({ error: 'Invalid action provided' });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return res.status(response.status).json({ error: `Gemini API responded with status: ${response.status}` });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    res.json({ result: generatedText.trim() });
  } catch (error) {
    console.error('Backend Server Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

export default app;

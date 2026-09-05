// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, payload } = await req.json()
    // @ts-ignore
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in Edge Function secrets')
    }

    let prompt = ''

    if (action === 'enhance_bullets') {
      const { description } = payload
      prompt = `You are an expert resume writer. Take the following work experience description and rewrite it into 3-4 professional, impactful, and ATS-optimized bullet points using strong action verbs. Return ONLY the bullet points, starting each with a dash (-), no introductory text.\n\nDescription:\n${description}`
    } else if (action === 'generate_summary') {
      const { skills, education, experience } = payload
      prompt = `You are an expert resume writer. Generate a highly professional 3-sentence summary for a resume based on the following details. Highlight the person's key skills, most relevant experience, and core strengths. Return ONLY the 3-sentence summary, no introductory text.\n\nSkills: ${skills}\nEducation: ${JSON.stringify(education)}\nExperience: ${JSON.stringify(experience)}`
    } else {
      throw new Error('Invalid action provided')
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      throw new Error(`Gemini API responded with status: ${response.status}`)
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return new Response(
      JSON.stringify({ result: generatedText.trim() }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: any) {
    console.error('Edge Function Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

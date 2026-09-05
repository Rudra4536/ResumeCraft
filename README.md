# ResumeCraft 🚀

ResumeCraft is a modern, AI-powered resume builder designed to help users craft professional, ATS-optimized resumes with ease. Built with a sleek, high-utility UI (inspired by Google's Kinetic design system), ResumeCraft leverages the power of generative AI to elevate your professional experience.

## ✨ Key Features

- **AI Smart Bullet Points**: Magically rewrite and enhance your raw work experience into professional, impactful, and ATS-optimized bullet points using strong action verbs.
- **Auto-Generate Professional Summary**: Automatically analyze your entered skills, education, and experience to generate a tailored, 3-sentence professional summary.
- **Real-time Live Preview**: See your resume update instantly on a stunning A4 document canvas as you type.
- **Supabase Integration**: Secure authentication and database storage for your resumes.
- **Dual-Pane Workspace**: A highly efficient workspace featuring an intuitive inspector rail on the left and a dynamic document stage on the right.

## 🛠️ Technology Stack

- **Frontend**: React + Vite (Fast, hot-module replacement)
- **Backend / Proxy**: Node.js + Express (Handles secure AI API requests)
- **AI Integration**: Google Gemini API (`gemini-3.6-flash`)
- **Database & Auth**: Supabase
- **Styling**: Vanilla CSS utilizing a custom "Kinetic AI" design system (Slate & Indigo theme)

---

## 💻 Local Development Setup

To run this project locally on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/Rudra4536/ResumeCraft.git
cd ResumeCraft
```

### 2. Install Dependencies
```bash
npm install
```
*(Also ensure your Express backend dependencies `express`, `cors`, and `dotenv` are installed)*

### 3. Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the Development Servers
You will need to run both the frontend and the backend simultaneously.

**Terminal 1 (Backend Server):**
```bash
node server.js
```
*(Runs the Express proxy on http://localhost:3001)*

**Terminal 2 (Frontend Vite Server):**
```bash
npm run dev
```
*(Runs the React application on http://localhost:5173)*

---

## 🚀 Deployment (Vercel)

This project is configured to deploy seamlessly to Vercel. A `vercel.json` file is included to automatically wrap the `server.js` Express backend into a Vercel Serverless Function, avoiding CORS issues and hiding the Gemini API key.

1. Push your repository to GitHub.
2. Import the repository into your Vercel dashboard.
3. During setup, add all three environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`) to the **Environment Variables** section.
4. Click **Deploy**.

## 🎨 Design System

The application utilizes a custom design system characterized by:
- **Typography**: Inter (strict, optical balance)
- **Colors**: Slate 50 (Backgrounds), Slate 100 (Wells), Pure White (Cards), Indigo 600 (Primary Actions).
- **AI Accents**: Generative AI actions feature ethereal Indigo-to-Violet linear gradients.
- **Depth**: The A4 Document canvas utilizes a multi-stage diffusion shadow to emulate a physical piece of paper floating above the workspace.

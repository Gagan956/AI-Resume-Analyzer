# AI Resume Analyzer

AI Resume Analyzer is a backend service that uses **Google's** **Gemini AI** to analyze resumes against job descriptions. It provides ATS compatibility scores, detailed feedback, and actionable suggestions to improve resume-job match
---

##  Features

* AI-Powered Analysis: Deep analysis using Google Gemini AI
* ATS Score Generation: 0-100 compatibility score
* Multi-Format Support: PDF & DOCX resume parsing
* Smart Fallback: Basic analysis when AI is unavailable 
* Real-time Processing: Fast analysis with immediate results
* Give matching score 

---

 ## Analysis Includes
 
* Keyword matching analysis
* Skills and experience evaluation
* Education and certification assessment
* Achievement and metrics review
* Format and readability check
  
---
##  Tech Stack

### Frontend

* React 
* Vite
* Axios
* Tailwind CSS
* Redux

### Backend

* Node.js
* Express.js
* LLM (Gemini API)
  
---

## Setup Instructions (Run Locally)

### Prerequisites

* Node.js (v18+ recommended)
* npm or yarn

---

###  Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Run in production mode
npm start

# OR run in development mode with nodemon
npm run dev
```

Create a `.env` file in the backend root:

```env
PORT=5000
GEMINI_API_KEY=API-Secret-key


NODE_ENV=development
```

Backend will run on:

```
http://localhost:5000
```

---

### 🔹 Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Run frontend
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---
import express from 'express';
import cors from 'cors';
import resumeRoutes from './routes/resumeRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;


const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/resume', resumeRoutes);



// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Resume Analyzer API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling 
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    if (err.message === 'Only PDF and DOCX files are allowed') {
        return res.status(400).json({ 
            success: false,
            error: err.message 
        });
    }
    
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
            success: false,
            error: 'File too large. Maximum size is 10MB.' 
        });
    }
    
    res.status(500).json({ 
        success: false,
        error: err.message || 'Internal server error'
    });
});

app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
   
  
});


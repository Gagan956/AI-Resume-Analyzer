import express from 'express';
import multer from 'multer';
import { analyzeResumeController } from '../controllers/resumeController.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create temporary uploads directory
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
 
}

// Configure multer for temporary file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // this generate unique filename to prevent collisions
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const safeName = uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, safeName);
    }
});

// File filter to allow only PDF and DOCX
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and DOCX files are allowed'), false);
    }
};

// Configure multer
const upload = multer({
    storage,
    limits: { 
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter
});

// Routes
router.post('/analyze', upload.single('resume'), analyzeResumeController);



export default router;
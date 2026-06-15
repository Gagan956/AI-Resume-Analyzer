import { extractTextFromFile } from '../utils/pdfParser.js';
import { analyzeResume } from '../services/resumeService.js';
import fs from 'fs';


// Controller for analyzing resumes
export const analyzeResumeController = async (req, res) => {
    let filePath = null;
    
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                error: 'No resume file uploaded. Please upload a PDF or DOCX file.' 
            });
        }

        filePath = req.file.path;
        const originalName = req.file.originalname;
        const jobDescription = req.body.jobDescription || '';
        
        // console.log(` Processing file: ${originalName}`);
        // console.log(` File size: ${(req.file.size / 1024).toFixed(2)} KB`);
        
        // Extract text from the uploaded file
        let resumeText;
        try {
            resumeText = await extractTextFromFile(filePath, originalName);
        } catch (extractionError) {
            // Clean up file on error
            if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            
            return res.status(400).json({ 
                success: false,
                error: 'Unable to extract text from your resume.',
                solution: 'Your PDF appears to be scanned or image-based. Please save your resume as a text-based PDF by:\n1. Opening your resume in Word/Google Docs\n2. Click File → Save As/Download\n3. Choose "PDF" format\n4. Upload the new PDF file',
                details: extractionError.message
            });
        }
        
        // Validate extracted text
        if (!resumeText || resumeText.trim().length < 50) {
            if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return res.status(400).json({ 
                success: false,
                error: 'Could not extract enough text from file',
                solution: 'Please ensure your document contains at least 50 characters of text and is not a scanned image.'
            });
        }
        
      
        
        // Analyze the resume
        const analysis = await analyzeResume(resumeText, jobDescription);
        
        // Clean up uploaded file 
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`🗑️ Deleted temporary file: ${filePath}`);
        }
        
        
        res.json({
            success: true,
            analysis,
            metadata: {
                fileName: originalName,
                textLength: resumeText.length,
                analyzedAt: new Date().toISOString()
            }
        });
        
    } catch (error) {
        if (filePath && fs.existsSync(filePath)) {  // Clean up file if it exists
            try {
                fs.unlinkSync(filePath);
                console.log(`🗑️ Deleted temporary file after error: ${filePath}`);
            } catch (err) {
                console.error('Error deleting file:', err);
            }
        }
        
    
        res.status(500).json({ 
            success: false,
            error: error.message || 'Failed to analyze resume',
            suggestion: 'Please try again with a different file or check the file format.'
        });
    }
};
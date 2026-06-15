import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse-fixed'; 

export const extractTextFromFile = async (filePath, originalName) => {
    try {
        console.log(`Processing file: ${originalName}`);
        
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        
        const fileBuffer = fs.readFileSync(filePath);
        const fileExtension = originalName.toLowerCase().split('.').pop();
        
        if (fileExtension === 'pdf') {
            return await extractFromPDF(fileBuffer);
        } else if (fileExtension === 'docx') {
            return await extractFromDOCX(fileBuffer);
        } else {
            throw new Error('Unsupported file format. Please upload PDF or DOCX.');
        }
    } catch (error) {
        console.error("Text extraction error:", error);
        throw new Error(`Failed to process file: ${error.message}`);
    }
};

// PDF text extraction using pdf-parse
const extractFromPDF = async (buffer) => {
    try {
        
        const data = await pdf(buffer);
        let text = data.text;
        
        // Clean up text
        text = text.replace(/\s+/g, ' ').trim();
        
        if (text.length > 50) {
            console.log(`PDF extracted successfully: ${text.length} characters`);
            return text;
        }
        
        throw new Error('Insufficient text extracted from PDF');
    } catch (error) {
        console.error("PDF extraction error:", error);
        throw new Error(`Failed to extract text from PDF: ${error.message}. Please ensure it is a text-based PDF.`);
    }
};

const extractFromDOCX = async (buffer) => {
    try {
        const result = await mammoth.extractRawText({ buffer });
        let text = result.value;
        
       
        text = text.replace(/\s+/g, ' ').trim();
        
        if (text.length > 50) {
            console.log(`DOCX extracted successfully: ${text.length} characters`);
            return text;
        }
        
        throw new Error('Insufficient text extracted from DOCX');
    } catch (error) {
        console.error("DOCX extraction error:", error);
        throw new Error(`DOCX extraction failed: ${error.message}`);
    }
};
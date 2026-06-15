import { model, generationConfig } from '../config/gemini.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function callGeminiWithRetry(prompt, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: generationConfig
            });
            return result.response.text();
        } catch (error) {
            lastError = error;
            console.error(`Attempt ${attempt} failed:`, error.message);
            
            if (error.message?.includes('503') || 
                error.message?.includes('429') || 
                error.message?.includes('500') ||
                error.message?.includes('RESOURCE_EXHAUSTED')) {
                const waitTime = Math.min(attempt * 3000, 15000);
                console.log(`Waiting ${waitTime}ms before retry...`);
                await delay(waitTime);
                continue;
            }
            
            throw error;
        }
    }
    
    throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}

// Simple level detection - just for fresher focus
function getLevel(resumeText) {
    const text = resumeText.toLowerCase();
    
    //  for senior
    if (text.includes('senior') || text.includes('lead') || text.includes('manager') || text.includes('director')) {
        return 'Senior Level';
    }
    // for mid-level 
    if (text.includes('software engineer') || text.includes('developer') || text.includes('3+ years') || text.includes('4+ years')) {
        return 'Mid Level';
    }
    //  fresher/entry level
    return 'Entry Level';
}

//  JD match 
function calculateJDmatch(resumeText, jobDescription) {
    if (!jobDescription || jobDescription.trim().length < 20) {
        return null;
    }
    
    //  keyword matching
    const resumeLower = resumeText.toLowerCase();
    const jdLower = jobDescription.toLowerCase();
    
    // keywords for freshers
    const keywords = [
        'python', 'java', 'javascript', 'react', 'angular', 'node', 'sql', 
        'mongodb', 'aws', 'docker', 'git', 'html', 'css', 'api', 'rest',
        'teamwork', 'communication', 'problem solving', 'leadership'
    ];
    
    let totalKeywords = 0;
    let matchedKeywords = 0;
    
    keywords.forEach(keyword => {
        if (jdLower.includes(keyword)) {
            totalKeywords++;
            if (resumeLower.includes(keyword)) {
                matchedKeywords++;
            }
        }
    });
    
    if (totalKeywords === 0) return 50;
    
    const matchPercentage = (matchedKeywords / totalKeywords) * 100;
    return Math.min(100, Math.max(0, Math.round(matchPercentage)));
}

export const analyzeResume = async (resumeText, jobDescription = '') => {
    try {
        //  check if resume has content
        if (!resumeText || resumeText.length < 100) {
            return getSimpleFallbackResponse();
        }
        
        // Detect level
        const level = getLevel(resumeText);
        
        // Calculate JD match if provided
        const jdMatchPercent = calculateJDmatch(resumeText, jobDescription);
        
        // Simple prompt that won't confuse
        const prompt = `
        You are helping a FRESH GRADUATE / BEGINNER improve their resume.
        Be KIND and HELPFUL. Give simple, actionable advice.
        
        Resume Content:
        ${resumeText.substring(0, 8000)}
        
        ${jobDescription ? `Job Description (for reference):\n${jobDescription.substring(0, 2000)}` : ''}
        
        Return ONLY valid JSON. No extra text or explanation.
        
        {
            "atsScore": 75,
            "keySkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
            "missingSkills": ["skill1", "skill2", "skill3"],
            "strengths": [
                "Write 3 good things about this resume",
                "Be specific and encouraging"
            ],
            "areasToImprove": [
                "Write 3 things that can be better",
                "Give simple, clear advice"
            ],
            "summary": "Write 2 sentences summarizing this candidate",
            "tips": [
                "Tip 1: Simple actionable advice",
                "Tip 2: Easy to understand suggestion",
                "Tip 3: Quick win improvement",
                "Tip 4: Another helpful tip",
                "Tip 5: Final recommendation"
            ]
        }
        
        Guidelines:
        - Score between 0-100 (higher is better)
        - For freshers: 70+ is good, 80+ is excellent
        - Keep language simple and encouraging
        - Don't use technical jargon
        - Focus on what they can easily fix
        `;
        
        const responseText = await callGeminiWithRetry(prompt);
        
        // Extract JSON
        let jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            jsonMatch = responseText.match(/\{[\s\S]*?\}/);
        }
        
        if (jsonMatch) {
            let jsonStr = jsonMatch[0];
            jsonStr = jsonStr.replace(/```json\s*/g, '');
            jsonStr = jsonStr.replace(/```\s*/g, '');
            jsonStr = jsonStr.replace(/,[\s]*}/g, '}');
            jsonStr = jsonStr.replace(/,[\s]*]/g, ']');
            
            const analysis = JSON.parse(jsonStr);
            
            // Calculate final score with JD match if available
            let finalScore = Math.min(100, Math.max(0, parseInt(analysis.atsScore) || 65));
            
            if (jdMatchPercent !== null) {
                //  average: 70% resume quality + 30% job match
                finalScore = Math.round((finalScore * 0.7) + (jdMatchPercent * 0.3));
                console.log(`Job match: ${jdMatchPercent}%, Final score: ${finalScore}`);
            }
            
            // Clean up any negative words
            const cleanText = (text) => {
                if (!text || typeof text !== 'string') return text;
                return text
                    .replace(/unable|cannot|could not|failed|poor|lacking|insufficient|weak/gi, '')
                    .replace(/bad|terrible|horrible|awful/gi, '')
                    .trim();
            };
            
            return {
                atsScore: finalScore,
                experienceLevel: level,
                keySkills: (analysis.keySkills || getDefaultSkills()).slice(0, 8),
                missingSkills: (analysis.missingSkills || []).slice(0, 6),
                strengths: (analysis.strengths || getDefaultStrengths()).map(s => cleanText(s)).slice(0, 4),
                areasForImprovement: (analysis.areasToImprove || getDefaultImprovements()).map(s => cleanText(s)).slice(0, 4),
                candidateSummary: cleanText(analysis.summary) || "Enthusiastic fresher ready to start their career!",
                improvementPoints: (analysis.tips || getDefaultTips()).slice(0, 6),
                keywordOptimization: getSimpleKeywords(jdMatchPercent),
                formattingIssues: getSimpleFormatting(),
                jdMatch: jdMatchPercent !== null ? {
                    percentage: jdMatchPercent,
                    score: 'Keyword Match'
                } : null
            };
        }
        
        throw new Error('No valid JSON found');
        
    } catch (error) {
        console.error('Error:', error.message);
        return getSimpleFallbackResponse();
    }
};

// functions for freshers
function getDefaultSkills() {
    return ["Communication", "Teamwork", "Quick Learner", "Problem Solving", "Time Management"];
}

function getDefaultStrengths() {
    return [
        "Shows enthusiasm and willingness to learn",
        "Has basic understanding of key concepts",
        "Ready to take on new challenges"
    ];
}

function getDefaultImprovements() {
    return [
        "Add more details about your projects",
        "List specific technical skills you know",
        "Include any internships or volunteer work"
    ];
}

function getDefaultTips() {
    return [
        " Add a clear career objective at the top",
        " List at least 5-8 technical skills",
        " Describe 2-3 projects with what you built",
        " Include your education with percentage/GPA",
        " Add links to GitHub or LinkedIn",
        " Use action words like 'Created', 'Built', 'Developed'"
    ];
}

function getSimpleKeywords(hasJD) {
    if (hasJD) {
        return [
            "Add keywords from the job description",
            "Include skills mentioned in the job posting",
            "Match your experience with job requirements"
        ];
    }
    return [
        "Add more technical keywords",
        "Include industry-specific terms",
        "Use action verbs in descriptions"
    ];
}

function getSimpleFormatting() {
    return [
        "Keep your resume clean and easy to read",
        "Use bullet points instead of paragraphs",
        "Make sure headings are clear and bold"
    ];
}

function getSimpleFallbackResponse() {
    return {
        atsScore: 50,
        experienceLevel: "Entry Level",
        keySkills: ["Communication", "Teamwork", "Quick Learner", "Problem Solving"],
        missingSkills: ["Technical Skills", "Project Experience", "Internships"],
        strengths: [
            "You're taking the first step by creating a resume!",
            "Everyone starts somewhere - keep improving!"
        ],
        areasForImprovement: [
            "Add your educational background",
            "Include any projects you've worked on",
            "List skills you have learned",
            "Add any internships or volunteer work"
        ],
        candidateSummary: "Enthusiastic fresher ready to begin their career journey. With some improvements to add more details about skills and projects, this resume can become very strong.",
        improvementPoints: getDefaultTips(),
        keywordOptimization: getSimpleKeywords(false),
        formattingIssues: getSimpleFormatting(),
        jdMatch: null
    };
}
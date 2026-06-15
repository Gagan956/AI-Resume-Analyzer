import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            throw new Error(error.response.data.error || 'Server error occurred');
        } else if (error.request) {
            throw new Error('Cannot connect to server. Please check if backend is running.');
        } else {
            throw error;
        }
    }
);

export const resumeAPI = {
    analyzeResume: async (resumeFile, jobDescription = '') => {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('jobDescription', jobDescription);
        
        const response = await apiClient.post('/resume/analyze', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response.data;
    }
};

export default apiClient;
import { useState } from 'react';
import ResumeUploader from './components/ResumeUploader';
import AnalysisResults from './components/AnalysisResults';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalysisComplete = (data) => {
    setAnalysis(data);
  };

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Resume Analyzer
          </h1>
          <p className="text-gray-600">
            Upload your resume and get AI-powered insights
          </p>
        </div>
        
        <div className="space-y-8">
          <ResumeUploader 
            onAnalysisComplete={handleAnalysisComplete}
            onLoading={handleLoading}
          />
          
          {loading && <LoadingSpinner />}
          
          {analysis && !loading && (
            <AnalysisResults analysis={analysis} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
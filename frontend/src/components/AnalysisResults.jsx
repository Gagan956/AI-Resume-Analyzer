import ScoreCircle from './ScoreCircle';

const AnalysisResults = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        
        {/* Header  */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Analysis Results</h3>
            <p className="text-gray-600">AI-powered resume insights</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {analysis.experienceLevel || "Mid Level"}
            </span>
          </div>
        </div>

        {/* Score Circle - Center  */}
        <div className="flex justify-center mb-8">
          <ScoreCircle score={analysis.atsScore || 80} />
        </div>

        {/* Candidate Summary  */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{analysis.candidateSummary}</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          
       
          <div className="space-y-6">
            {/* Key Skills Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Skills</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keySkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Missing Skills</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Strengths & Areas for Improvement */}
          <div className="space-y-6">
        
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Strengths</h3>
              <ul className="space-y-2">
                {analysis.strengths?.map((strength, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Areas for Improvement</h3>
              <ul className="space-y-2">
                {analysis.areasForImprovement?.map((area, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-orange-500 mr-2">!</span>
                    <span className="text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* JD Match Section */}
        {analysis.jdMatch && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Match with Job Description:</span>
              <span className="text-2xl font-bold text-blue-600">{analysis.jdMatch.percentage}%</span>
            </div>
          </div>
        )}

        {/* Improvement Points */}
        {analysis.improvementPoints && analysis.improvementPoints.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3"> Key Improvement Points</h3>
            <div className="space-y-2">
              {analysis.improvementPoints.map((point, idx) => (
                <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-800">{point}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;
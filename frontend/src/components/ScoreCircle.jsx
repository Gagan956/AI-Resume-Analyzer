
const ScoreCircle = ({ score }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  let color = '#ef4444';
  if (score >= 70) color = '#10b981';
  else if (score >= 50) color = '#f59e0b';
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color }}>
            {score}
          </span>
          <span className="text-sm text-gray-600">ATS Score</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreCircle;
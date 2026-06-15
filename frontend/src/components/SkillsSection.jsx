

const SkillsSection = ({ skills, missingSkills }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills?.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Missing Skills</h3>
        <div className="flex flex-wrap gap-2">
          {missingSkills?.map((skill, idx) => (
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
  );
};

export default SkillsSection;
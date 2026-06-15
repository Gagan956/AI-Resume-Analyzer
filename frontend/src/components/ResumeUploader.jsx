import { useState } from "react";
import { resumeAPI } from "../config/api";

const ResumeUploader = ({ onAnalysisComplete, onLoading }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setResumeFile(file);
      setFileName(file.name);
    } else {
      alert("Please upload a PDF or DOCX file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert("Please select a resume file");
      return;
    }

    onLoading(true);

    try {
      const response = await resumeAPI.analyzeResume(
        resumeFile,
        jobDescription,
      );

      if (response.success) {
        onAnalysisComplete(response.analysis);
      } else {
        alert(response.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to analyze resume. Please try again.");
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Resume Analyzer</h2>
      <p className="text-gray-600 mb-6">
        Upload your resume and get AI-powered insights
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume (PDF or DOCX Max-10MB)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="cursor-pointer">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-gray-600">
                {fileName || "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PDF or DOCX only, max 10MB
              </p>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description(Paste JD here )
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to get Match score"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="4"
          />
          <p className="text-xs text-gray-500 mt-1">
            Adding a job description helps and analyzes 
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!resumeFile}
        >
          Analyze Resume
        </button>
      </form>
    </div>
  );
};

export default ResumeUploader;

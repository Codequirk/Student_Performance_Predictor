import React, { useState } from "react";
import { predictStudent } from "../services/api";
import ResultCard from "./ResultCard";
import { useDarkMode } from "../context/DarkModeContext";

export default function PredictionForm() {
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    student_name: "",
    roll_number: "",
    attendance: 75,
    prev_cgpa: 7.5,
    study_hours: 4,
    sleep_hours: 7,
    assignments: [{ subject_name: "", marks_obtained: 0, marks_total: 100 }],
    subjects: [{ subject_name: "", marks_obtained: 0, marks_total: 100 }],
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "student_name" || name === "roll_number" ? value : (value === "" ? 0 : parseFloat(value)),
    });
  };

  const handleAssignmentChange = (index, field, value) => {
    const newAssignments = [...formData.assignments];
    if (field === "subject_name") {
      newAssignments[index][field] = value;
    } else {
      newAssignments[index][field] = parseFloat(value) || 0;
    }
    setFormData({ ...formData, assignments: newAssignments });
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...formData.subjects];
    if (field === "subject_name") {
      newSubjects[index][field] = value;
    } else {
      newSubjects[index][field] = parseFloat(value) || 0;
    }
    setFormData({ ...formData, subjects: newSubjects });
  };

  const addAssignment = () => {
    setFormData({
      ...formData,
      assignments: [...formData.assignments, { subject_name: "", marks_obtained: 0, marks_total: 100 }],
    });
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { subject_name: "", marks_obtained: 0, marks_total: 100 }],
    });
  };

  const removeAssignment = (index) => {
    if (formData.assignments.length > 1) {
      setFormData({
        ...formData,
        assignments: formData.assignments.filter((_, i) => i !== index),
      });
    }
  };

  const removeSubject = (index) => {
    if (formData.subjects.length > 1) {
      setFormData({
        ...formData,
        subjects: formData.subjects.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validation
      if (!formData.student_name.trim()) {
        throw new Error("Student name is required");
      }

      if (formData.assignments.some((a) => !a.subject_name.trim())) {
        throw new Error("All assignment subject names are required");
      }

      if (formData.subjects.some((s) => !s.subject_name.trim())) {
        throw new Error("All subject names are required");
      }

      // Validate marks <= total marks
      if (formData.assignments.some((a) => a.marks_obtained > a.marks_total || a.marks_total <= 0)) {
        throw new Error("Assignment: Marks obtained cannot exceed total marks, and total marks must be greater than 0");
      }

      if (formData.subjects.some((s) => s.marks_obtained > s.marks_total || s.marks_total <= 0)) {
        throw new Error("Subject: Marks obtained cannot exceed total marks, and total marks must be greater than 0");
      }

      const response = await predictStudent(formData);
      setResult(response.data);
    } catch (err) {
      setError(err.message || "Prediction failed. Please check your inputs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return <ResultCard result={result} formData={formData} onBack={() => setResult(null)} />;
  }

  return (
    <form onSubmit={handleSubmit} className={`${isDarkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <h2 className="text-2xl font-bold mb-6">Student Performance Predictor</h2>

      {error && (
        <div className={`mb-4 p-3 ${isDarkMode ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-100 border-red-400 text-red-700'} border rounded`}>
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Student Name *
          </label>
          <input
            type="text"
            name="student_name"
            value={formData.student_name}
            onChange={handleBasicChange}
            placeholder="Enter student name"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white'}`}
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Roll Number</label>
          <input
            type="text"
            name="roll_number"
            value={formData.roll_number}
            onChange={handleBasicChange}
            placeholder="Enter roll number"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white'}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Attendance (%) - {formData.attendance}
          </label>
          <input
            type="range"
            name="attendance"
            min="0"
            max="100"
            value={formData.attendance}
            onChange={handleBasicChange}
            className="w-full"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Previous CGPA (0-10) - {formData.prev_cgpa}
          </label>
          <input
            type="range"
            name="prev_cgpa"
            min="0"
            max="10"
            step="0.1"
            value={formData.prev_cgpa}
            onChange={handleBasicChange}
            className="w-full"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Study Hours/Day (0-24) - {formData.study_hours}
          </label>
          <input
            type="range"
            name="study_hours"
            min="0"
            max="24"
            value={formData.study_hours}
            onChange={handleBasicChange}
            className="w-full"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Sleep Hours/Day (0-24) - {formData.sleep_hours}
          </label>
          <input
            type="range"
            name="sleep_hours"
            min="0"
            max="24"
            value={formData.sleep_hours}
            onChange={handleBasicChange}
            className="w-full"
          />
        </div>
      </div>

      {/* Assignments Section */}
      <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gradient-to-r from-slate-600 to-violet-800' : 'bg-violet-50'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-blue-200' : 'text-gray-800'}`}>Assignments</h3>
          <button
            type="button"
            onClick={addAssignment}
            className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition"
          >
            + Add Assignment
          </button>
        </div>

        {formData.assignments.map((assignment, index) => (
          <div key={index} className={`mb-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-blue-200'}`}>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Subject name"
                value={assignment.subject_name}
                onChange={(e) => handleAssignmentChange(index, "subject_name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'border-gray-300 bg-white'}`}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Marks Obtained</label>
                <input
                  type="number"
                  placeholder="Obtained"
                  min="0"
                  value={assignment.marks_obtained}
                  onChange={(e) => handleAssignmentChange(index, "marks_obtained", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'border-gray-300 bg-white'}`}
                  required
                />
              </div>
              <div>
                <label className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Marks</label>
                <input
                  type="number"
                  placeholder="Total"
                  min="0.01"
                  step="0.01"
                  value={assignment.marks_total}
                  onChange={(e) => handleAssignmentChange(index, "marks_total", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'border-gray-300 bg-white'}`}
                  required
                />
              </div>
            </div>
            {assignment.marks_total > 0 && (
              <div className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
                Percentage: {((assignment.marks_obtained / assignment.marks_total) * 100).toFixed(2)}%
              </div>
            )}
            {formData.assignments.length > 1 && (
              <button
                type="button"
                onClick={() => removeAssignment(index)}
                className="mt-2 px-3 py-1 bg-red-900 text-white text-sm rounded-lg hover:bg-gray-900"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Subjects Section */}
      <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-green-900 border border-green-700' : 'bg-green-50'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-green-200' : 'text-gray-800'}`}>Subjects</h3>
          <button
            type="button"
            onClick={addSubject}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            + Add Subject
          </button>
        </div>

        {formData.subjects.map((subject, index) => (
          <div key={index} className={`mb-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-green-200'}`}>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Subject name"
                value={subject.subject_name}
                onChange={(e) => handleSubjectChange(index, "subject_name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'border-gray-300 bg-white'}`}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Marks Obtained</label>
                <input
                  type="number"
                  placeholder="Obtained"
                  min="0"
                  value={subject.marks_obtained}
                  onChange={(e) => handleSubjectChange(index, "marks_obtained", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'border-gray-300 bg-white'}`}
                  required
                />
              </div>
              <div>
                <label className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Marks</label>
                <input
                  type="number"
                  placeholder="Total"
                  min="0.01"
                  step="0.01"
                  value={subject.marks_total}
                  onChange={(e) => handleSubjectChange(index, "marks_total", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'border-gray-300 bg-white'}`}
                  required
                />
              </div>
            </div>
            {subject.marks_total > 0 && (
              <div className={`text-sm ${isDarkMode ? 'text-green-200' : 'text-gray-600'}`}>
                Percentage: {((subject.marks_obtained / subject.marks_total) * 100).toFixed(2)}%
              </div>
            )}
            {formData.subjects.length > 1 && (
              <button
                type="button"
                onClick={() => removeSubject(index)}
                className="mt-2 px-3 py-1 from bg-red-900 to bg text-white text-sm rounded-lg hover:bg-gray-900"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-600 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50"
      >
        {loading ? "Predicting..." : "Get Prediction"}
      </button>
    </form>
  );
}

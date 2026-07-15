import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./styles/ApplyJob.css";

function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    currentJob: "",
    previousJob: "",
    expectedSalary: "",
  });

  const [resume, setResume] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert("Please upload your resume.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("contactNumber", formData.contactNumber);
      data.append("currentJob", formData.currentJob);
      data.append("previousJob", formData.previousJob);
      data.append("expectedSalary", formData.expectedSalary);
      data.append("resume", resume);

      const res = await api.post(
        `/applications/apply/${jobId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message || "Application Submitted Successfully");

      navigate("/my-applications");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Application submission failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-page">
      <div className="apply-card">
        <h2 className="title">Apply for Job</h2>

        <p className="subtitle">
          Fill your details and upload your latest resume.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Contact Number</label>

            <input
              type="text"
              name="contactNumber"
              placeholder="9876543210"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Current Role</label>

            <input
              type="text"
              name="currentJob"
              placeholder="Frontend Developer"
              value={formData.currentJob}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Previous Experience</label>

            <input
              type="text"
              name="previousJob"
              placeholder="1 Year MERN Stack"
              value={formData.previousJob}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Expected Salary</label>

            <input
              type="text"
              name="expectedSalary"
              placeholder="4 LPA"
              value={formData.expectedSalary}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Upload Resume</label>

            <div className="file-upload">
              <p>
                {resume
                  ? resume.name
                  : "Click here to upload your resume"}
              </p>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "🚀 Send Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplyJob;
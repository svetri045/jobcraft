import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "./styles/PostJob.css";

function PostJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    companyName: "",
    vacancies: 1,
    expiryDays: 30,
  });

  useEffect(() => {
    if (id) {
      const fetchJob = async () => {
        try {
          const res = await api.get(`/jobs/${id}`);
          const job = res.data.job;

          setFormData({
            title: job.title || "",
            description: job.description || "",
            location: job.location || "",
            salary: job.salary || "",
            companyName: job.company || "",
            vacancies: job.vacancies || 1,
            expiryDays: 30,
          });
        } catch (error) {
          console.log(error);
          alert("Failed to load job");
        }
      };

      fetchJob();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const expiryDate = new Date();

      expiryDate.setDate(
        expiryDate.getDate() + Number(formData.expiryDays)
      );

      const submitData = {
        ...formData,
        vacancies: Number(formData.vacancies),
        expiryDate,
      };

      if (id) {
        await api.put(
          `/jobs/${id}`,
          submitData
        );

        alert("✅ Job Updated Successfully");
      } else {
        await api.post(
          "/jobs",
          submitData
        );

        alert("✅ Job Posted Successfully");
      }

      navigate("/recruiter-dashboard");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Error processing request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="postJob-page">
      <div className="postJob-card">
        <div className="postJob-header">
          <h2>
            {id ? "✏️ Edit Job" : "🚀 Post New Job"}
          </h2>

          <p>
            Manage your job vacancies with expiry date
          </p>
        </div>

        <form
          className="postJob-form"
          onSubmit={handleSubmit}
        >
          <div className="postJob-grid">
            <div className="postJob-field">
              <label>
                Job Title
              </label>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="postJob-field">
              <label>
                Company Name
              </label>

              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="postJob-field">
              <label>
                Location
              </label>

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="postJob-field">
              <label>
                Salary
              </label>

              <input
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>

            <div className="postJob-field">
              <label>
                Number of Vacancies
              </label>

              <input
                type="number"
                name="vacancies"
                min="1"
                value={formData.vacancies}
                onChange={handleChange}
              />
            </div>

            <div className="postJob-field">
              <label>
                Job Active Days
              </label>

              <input
                type="number"
                name="expiryDays"
                min="1"
                value={formData.expiryDays}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="postJob-field">
            <label>
              Description
            </label>

            <textarea
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="postJob-button"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : id
              ? "Update Job"
              : "Publish Job"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
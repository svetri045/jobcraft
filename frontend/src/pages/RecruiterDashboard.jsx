import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import "./styles/RecruiterDashboard.css";

function RecruiterDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("applications");

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "recruiter") {
      navigate("/");
    }
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [appRes, jobRes] = await Promise.all([
        api.get("/applications/recruiter/my-applications"),
        api.get("/jobs/my-jobs"),
      ]);

      setApplications(
        appRes.data.applications || []
      );

      setMyJobs(
        jobRes.data.jobs || []
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "recruiter") {
      loadDashboardData();
    }
  }, [user]);

  const updateStatus = async (id, status) => {
    let payload = { status };

    if (status === "interview") {
      const date = prompt(
        "Interview Date DD/MM/YYYY"
      );

      const time = prompt(
        "Interview Time"
      );

      if (!date || !time) return;

      payload = {
        status,
        interviewTime: `${date} at ${time}`,
      };
    }

    if (status === "not-selected") {
      const reason = prompt(
        "Reject Reason"
      );

      if (!reason) return;

      payload = {
        status,
        rejectReason: reason,
      };
    }

    try {
      await api.put(
        `/applications/status-update/${id}`,
        payload
      );

      alert("Updated Successfully");

      loadDashboardData();
    } catch (error) {
      alert("Update Failed");
    }
  };

  const deleteJob = async (id) => {
    if (window.confirm("Delete Job?")) {
      try {
        await api.delete(`/jobs/${id}`);

        loadDashboardData();
      } catch (error) {
        alert("Delete Failed");
      }
    }
  };

  if (loading) {
    return (
      <div className="recruiterLoading">
        Loading Workspace...
      </div>
    );
  }

  return (
    <div className="recruiterDashboardPage">
      <div className="recruiterHeader">
        <h2>
          Enterprise Recruiter Console
        </h2>

        <p>
          Manage candidates and job pipeline
        </p>
      </div>

      <div className="recruiterTabs">
        <button
          className={
            activeTab === "applications"
              ? "activeTab"
              : ""
          }
          onClick={() =>
            setActiveTab("applications")
          }
        >
          📩 Applications
        </button>

        <button
          className={
            activeTab === "jobs"
              ? "activeTab"
              : ""
          }
          onClick={() =>
            setActiveTab("jobs")
          }
        >
          📁 My Jobs
        </button>
      </div>

      {activeTab === "applications" ? (
        <div className="recruiterTableCard">
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>
                    <div className="applicantName">
                      👤 {app.applicant?.name}
                    </div>

                    <a
                      className="emailLink"
                      href={`mailto:${app.applicant?.email}`}
                    >
                      📧 {app.applicant?.email}
                    </a>
                  </td>

                  <td>
                    {app.resumeUrl ? (
                      <a
                        href={`${BASE_URL}${app.resumeUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="resumeLink"
                      >
                        📄 View PDF
                      </a>
                    ) : (
                      "No File"
                    )}
                  </td>

                  <td>
                    <span
                      className={`status ${app.status}`}
                    >
                      {app.status}
                    </span>
                  </td>

                  <td>
                    <div className="actionGroup">
                      <button
                        className="selectBtn"
                        onClick={() =>
                          updateStatus(
                            app._id,
                            "selected"
                          )
                        }
                      >
                        Select
                      </button>

                      <button
                        className="interviewBtn"
                        onClick={() =>
                          updateStatus(
                            app._id,
                            "interview"
                          )
                        }
                      >
                        Interview
                      </button>

                      <button
                        className="rejectBtn"
                        onClick={() =>
                          updateStatus(
                            app._id,
                            "not-selected"
                          )
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="jobList">
          {myJobs.map((job) => (
            <div
              className="jobRow"
              key={job._id}
            >
              <div>
                <h4>{job.title}</h4>

                <p>
                  💰 {job.salary}
                </p>
              </div>

              <div className="jobButtons">
                <button
                  className="editBtn"
                  onClick={() =>
                    navigate(
                      `/post-job/${job._id}`
                    )
                  }
                >
                  Edit
                </button>

                <button
                  className="deleteBtn"
                  onClick={() =>
                    deleteJob(job._id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecruiterDashboard;
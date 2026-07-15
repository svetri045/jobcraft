import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import "./styles/MyApplication.css";

function MyApplications() {
  const { user } = useContext(AuthContext);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyApplications = async () => {
    try {
      setLoading(true);

      const res = await api.get("/applications/my-applications");

      setApplications(res.data.applications || []);
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyApplications();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="myApplicationsLoading">
        🔄 Loading your applications...
      </div>
    );
  }

  return (
    <div className="myApplicationsPageWrapper">
      <div className="myApplicationsHeaderSection">
        <h2 className="myApplicationsTitle">
          My Applications
        </h2>

        <p className="myApplicationsSubtitle">
          Track your career progress in real-time.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="myApplicationsEmptyCard">
          🚀 You haven't applied to any jobs yet!
        </div>
      ) : (
        <div className="myApplicationsGrid">
          {applications.map((app) => (
            <div
              className="myApplicationCard"
              key={app._id}
            >
              <div className="myApplicationCardHeader">
                <div>
                  <h3 className="myApplicationJobTitle">
                    {app.job?.title || "Job removed"}
                  </h3>

                  <p className="myApplicationCompanyName">
                    🏢 {app.job?.company?.companyName || "Company not available"}
                  </p>
                </div>

                <span
                  className={`myApplicationStatusBadge ${
                    app.status?.toLowerCase()
                  }`}
                >
                  {app.status?.toUpperCase()}
                </span>
              </div>

              {(app.interviewTime || app.rejectReason) && (
                <div
                  className={`myApplicationInfoBox ${
                    app.status?.toLowerCase()
                  }`}
                >
                  <small>
                    {app.status?.toLowerCase() === "interview"
                      ? "📅 Scheduled Interview"
                      : "📢 Status Update"}
                  </small>

                  <strong>
                    {app.status?.toLowerCase() === "interview"
                      ? app.interviewTime
                      : app.rejectReason}
                  </strong>
                </div>
              )}

              <div className="myApplicationFooter">
                <span>
                  Applied on:{" "}
                  {new Date(app.createdAt).toLocaleDateString("en-IN")}
                </span>

                <span>
                  📍 {app.job?.location || "Location unavailable"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplications;
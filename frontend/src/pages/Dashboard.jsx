import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import "./styles/Dashboard.css";

function Dashboard() {
  const { user } = useContext(AuthContext);

  const [dashboardApplicationList, setDashboardApplicationList] =
    useState([]);

  const [dashboardLoadingState, setDashboardLoadingState] =
    useState(true);

  const loadDashboardApplications = async () => {
    try {
      setDashboardLoadingState(true);

      const apiEndpoint =
        user?.role === "recruiter"
          ? "/applications/recruiter/my-applications"
          : "/applications/my-applications";

      const response = await api.get(apiEndpoint);

      setDashboardApplicationList(
        response.data.applications || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setDashboardLoadingState(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardApplications();
    }
  }, [user]);

  const updateApplicationStatus = async (
    applicationId,
    selectedStatus
  ) => {
    let requestData = {
      status: selectedStatus,
    };

    if (selectedStatus === "interview") {
      const interviewDate =
        prompt("Enter Interview Date");

      const interviewTime =
        prompt("Enter Interview Time");

      if (!interviewDate || !interviewTime)
        return;

      requestData = {
        ...requestData,
        interviewTime: `${interviewDate} at ${interviewTime}`,
      };
    }

    try {
      await api.put(
        `/applications/status-update/${applicationId}`,
        requestData
      );

      loadDashboardApplications();
    } catch (error) {
      alert("Status update failed");
    }
  };

  const getApplicationStatusColor = (
    applicationStatus
  ) => {
    if (applicationStatus === "selected")
      return "#10b981";

    if (applicationStatus === "not-selected")
      return "#ef4444";

    if (applicationStatus === "interview")
      return "#3b82f6";

    return "#f59e0b";
  };

  if (dashboardLoadingState) {
    return (
      <div className="dashboardLoadingWrapper">
        Loading Applications...
      </div>
    );
  }

  return (
    <div className="dashboardPageWrapper">
      <div className="dashboardTopSection">
        <h1 className="dashboardMainHeading">
          {user?.role === "recruiter"
            ? "Recruitment Portal"
            : "Applied Jobs"}
        </h1>

        <p className="dashboardApplicationCounter">
          {dashboardApplicationList.length} Applications
        </p>
      </div>

      <div className="dashboardCardsGrid">
        {dashboardApplicationList.length === 0 ? (
          <div className="dashboardEmptyState">
            No Applications Found
          </div>
        ) : (
          dashboardApplicationList.map(
            (applicationItem) => (
              <div
                key={applicationItem._id}
                className="dashboardApplicationCard"
                style={{
                  borderTop: `4px solid ${getApplicationStatusColor(
                    applicationItem.status
                  )}`,
                }}
              >
                {/* Header */}

                <div className="dashboardCardHeader">
                  <div className="dashboardCompanyAvatar">
                    {applicationItem.job?.company
                      ?.charAt(0)
                      ?.toUpperCase() || "J"}
                  </div>

                  <div>
                    <h3 className="dashboardJobTitleText">
                      {applicationItem.job?.title ||
                        "Job Title"}
                    </h3>

                    <p className="dashboardCompanyText">
                      🏢{" "}
                      {applicationItem.job?.company ||
                        "Company"}
                    </p>
                  </div>
                </div>

                {/* Job Details */}

                <div className="dashboardInfoGrid">
                  <div className="dashboardInfoBox">
                    <span className="dashboardInfoLabel">
                      Location
                    </span>

                    <div className="dashboardInfoValue">
                      📍{" "}
                      {applicationItem.job?.location ||
                        "N/A"}
                    </div>
                  </div>

                  <div className="dashboardInfoBox">
                    <span className="dashboardInfoLabel">
                      Salary
                    </span>

                    <div className="dashboardInfoValue">
                      💰{" "}
                      {applicationItem.job?.salary ||
                        "N/A"}
                    </div>
                  </div>

                  <div className="dashboardInfoBox">
                    <span className="dashboardInfoLabel">
                      Applied Date
                    </span>

                    <div className="dashboardInfoValue">
                      {new Date(
                        applicationItem.createdAt
                      ).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="dashboardInfoBox">
                    <span className="dashboardInfoLabel">
                      Status
                    </span>

                    <div
                      className="dashboardInfoValue"
                      style={{
                        color:
                          getApplicationStatusColor(
                            applicationItem.status
                          ),
                      }}
                    >
                      {applicationItem.status?.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Recruiter Details */}

                <div className="dashboardInfoBox dashboardRecruiterBox">
                  <span className="dashboardInfoLabel">
                    Recruiter
                  </span>

                  <div className="dashboardInfoValue">
                    👤{" "}
                    {applicationItem.job?.createdBy
                      ?.name || "Not Available"}
                  </div>
                </div>

                {/* Interview */}

                {applicationItem.interviewTime && (
                  <div className="dashboardInterviewContainer">
                    <span className="dashboardInfoLabel">
                      Interview Schedule
                    </span>

                    <div className="dashboardInfoValue">
                      📅{" "}
                      {applicationItem.interviewTime}
                    </div>
                  </div>
                )}

                {/* Recruiter Controls */}

                {user?.role === "recruiter" && (
                  <select
                    className="dashboardStatusDropdown"
                    value={
                      applicationItem.status
                    }
                    onChange={(event) =>
                      updateApplicationStatus(
                        applicationItem._id,
                        event.target.value
                      )
                    }
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="interview">
                      Interview
                    </option>

                    <option value="selected">
                      Selected
                    </option>

                    <option value="not-selected">
                      Rejected
                    </option>
                  </select>
                )}
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default Dashboard;
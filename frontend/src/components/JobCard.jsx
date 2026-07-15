import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./JobCard.css";

function JobCard({ job }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleJobApplicationRedirect = () => {
    if (!user) {
      alert("Please login to apply");
      navigate("/login");
      return;
    }

    navigate(`/apply-job/${job._id}`);
  };

  const jobPostedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString()
    : "Recently";

  const jobExpiryDate = job.expiryDate
    ? new Date(job.expiryDate).toLocaleDateString()
    : "N/A";

  const jobExpiredStatus =
    job.expiryDate &&
    new Date(job.expiryDate) < new Date();

  const jobCompanyName =
    typeof job.company === "object"
      ? job.company?.name ||
        job.company?.companyName
      : job.company || "Company";

  return (
    <div className="jobCardWrapper">

      <div className="jobCardHeaderSection">

        <div>

          <h3 className="jobCardTitle">
            {job.title}
          </h3>

          <div className="jobCardCompanyName">
            🏢 {jobCompanyName}
          </div>

        </div>

        <span className="jobCardStatusBadge">
          {jobExpiredStatus ? "Expired" : "New"}
        </span>

      </div>

      <p className="jobCardDescription">
        {job.description?.length > 100
          ? `${job.description.substring(0, 100)}...`
          : job.description}
      </p>

      <div className="jobCardMetaInfo">

        <span>
          📍 {job.location || "Remote"}
        </span>

        <span>
          💰 {job.salary || "Negotiable"}
        </span>

        <span>
          👥 {job.vacancies || 1}
        </span>

        <span>
          📅 {jobExpiryDate}
        </span>

      </div>

      <div className="jobCardFooterSection">

        <span className="jobCardPostedDate">
          Posted: {jobPostedDate}
        </span>

        <button
          className="jobCardApplyButton"
          disabled={jobExpiredStatus}
          onClick={handleJobApplicationRedirect}
        >
          {jobExpiredStatus
            ? "Application Closed"
            : "Apply Now"}
        </button>

      </div>

    </div>
  );
}

export default JobCard;
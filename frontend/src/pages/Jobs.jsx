import { useEffect, useState } from "react";
import api from "../api/axios";
import JobCard from "../components/JobCard";
import "./styles/Jobs.css";

function Jobs() {
  const [jobListingData, setJobListingData] = useState([]);
  const [jobListingError, setJobListingError] = useState("");
  const [jobListingLoading, setJobListingLoading] = useState(true);

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const response = await api.get("/jobs");

        setJobListingData(response.data.jobs);
      } catch (error) {
        setJobListingError(
          "Failed to fetch jobs. Please try again later."
        );
      } finally {
        setJobListingLoading(false);
      }
    };

    fetchJobListings();
  }, []);

  return (
    <div className="jobListingPageWrapper">

      {/* Header */}

      <div className="jobListingHeaderSection">

        <h1 className="jobListingMainTitle">
          Explore Career Opportunities
        </h1>

        <p className="jobListingSubTitle">
          Find your next dream job from top tier companies
        </p>

      </div>

      {/* Error */}

      {jobListingError && (
        <div className="jobListingErrorBox">
          {jobListingError}
        </div>
      )}

      {/* Loading */}

      {jobListingLoading ? (
        <div className="jobListingLoadingBox">
          Loading amazing opportunities...
        </div>
      ) : jobListingData.length === 0 ? (
        <div className="jobListingEmptyState">

          <h3>
            No jobs posted yet!
          </h3>

          <p>
            Check back later.
          </p>

        </div>
      ) : (
        <div className="jobListingGridContainer">

          {jobListingData.map((jobItem) => (
            <JobCard
              key={jobItem._id}
              job={jobItem}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default Jobs;
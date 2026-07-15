import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  const stats = [
    {
      count: "25,000+",
      label: "Active Enterprise Jobs",
    },
    {
      count: "4,200+",
      label: "Verified Top Companies",
    },
    {
      count: "80,000+",
      label: "Successful Placements",
    },
  ];

  const features = [
    {
      title: "AI Resume Matching",
      desc: "Our smart AI matches candidate resumes perfectly with specific job descriptions.",
    },
    {
      title: "Real-time Tracking",
      desc: "Get instant application updates from companies.",
    },
    {
      title: "Secure & Verified",
      desc: "Every company profile is verified to prevent fake jobs.",
    },
  ];

  return (
    <div className="homePageWrapper">

      {/* Hero */}

      <section className="homePageHeroSection">

        <span className="homePageHeroBadge">
          The Future of Hiring is Here
        </span>

        <h1>JobPortal Enterprise</h1>

        <p>
          Bridging the gap between extraordinary talents and
          world-class companies through AI-powered matching.
        </p>

      </section>

      {/* Employer / Seeker */}

      <section className="homePagePortalSection">

        <div className="homePageGlassCard">

          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500"
            alt="Recruiter"
          />

          <h2>For Employers</h2>

          <p>
            Hire the best talent effortlessly.
            Manage your complete hiring pipeline.
          </p>

          <button
            onClick={() =>
              navigate(user ? "/dashboard" : "/login")
            }
          >
            {user ? "Go Dashboard" : "Employer Login"}
          </button>

        </div>

        <div className="homePageGlassCard">

          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500"
            alt="Jobseeker"
          />

          <h2>For Jobseekers</h2>

          <p>
            Explore jobs, apply instantly and track
            your applications.
          </p>

          <button
            className="homePagePrimaryButton"
            onClick={() =>
              navigate(user ? "/dashboard" : "/login")
            }
          >
            {user ? "Go Dashboard" : "Seeker Login"}
          </button>

        </div>

      </section>

      {/* Companies */}

      <section className="homePageCompaniesSection">

        <p>
          Trusted by industry leaders worldwide
        </p>

        <div>
          {[
            "Google",
            "Microsoft",
            "Amazon",
            "Netflix",
            "Meta",
            "Apple",
          ].map((company) => (
            <span key={company}>
              {company}
            </span>
          ))}
        </div>

      </section>

      {/* Stats */}

      <section className="homePageStatsSection">

        {stats.map((item) => (
          <div
            className="homePageStatCard"
            key={item.label}
          >
            <h3>{item.count}</h3>

            <p>{item.label}</p>
          </div>
        ))}

      </section>

      {/* Features */}

      <section className="homePageFeaturesSection">

        <h2>
          Why Choose JobPortal Enterprise?
        </h2>

        <p>
          Efficient hiring experience with modern technology.
        </p>

        <div className="homePageFeatureGrid">

          {features.map((feature) => (
            <div
              className="homePageFeatureCard"
              key={feature.title}
            >
              <h4>{feature.title}</h4>

              <p>{feature.desc}</p>
            </div>
          ))}

        </div>

      </section>

      {/* CTA */}

      {!user && (
        <section className="homePageCTASection">

          <h2>
            Ready to Take the Next Step?
          </h2>

          <p>
            Create your account today.
          </p>

          <button
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>

        </section>
      )}

      <footer className="homePageFooter">
        © 2026 JobPortal Enterprise
      </footer>

    </div>
  );
}

export default Home;
import { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="jpNavContainer">

        <NavLink
          to="/"
          className="jpNavLogo"
          onClick={closeMenu}
        >
          🎯 JobCraft
        </NavLink>

        <button
          className={`jpNavMenuButton ${
            menuOpen ? "jpNavMenuActive" : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div
          className={`jpNavLinksWrapper ${
            menuOpen ? "jpNavMobileOpen" : ""
          }`}
        >
          <NavLink
            to="/"
            onClick={closeMenu}
          >
            Home
          </NavLink>

          {(!user || user.role !== "recruiter") && (
            <NavLink
              to="/jobs"
              onClick={closeMenu}
            >
              Browse Jobs
            </NavLink>
          )}

          {user ? (
            <>
              {user.role === "seeker" && (
                <NavLink
                  to="/dashboard"
                  onClick={closeMenu}
                >
                  My Applications
                </NavLink>
              )}

              {user.role === "recruiter" && (
                <>
                  <NavLink
                    to="/recruiter-dashboard"
                    onClick={closeMenu}
                  >
                    Recruiter Board
                  </NavLink>

                  <NavLink
                    to="/post-job"
                    onClick={closeMenu}
                  >
                    Post Job
                  </NavLink>
                </>
              )}

              <NavLink
                to="/profile"
                onClick={closeMenu}
              >
                Profile
              </NavLink>

              <div className="jpNavUserSection">

                <span className="jpNavUserName">
                  👋 {user.name}
                </span>

                <button
                  className="jpNavLogoutButton"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={closeMenu}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="jpNavRegisterButton"
                onClick={closeMenu}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div
          className="jpNavOverlay"
          onClick={closeMenu}
        />
      )}
    </>
  );
}

export default Navbar;
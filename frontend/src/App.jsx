import { useContext } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  AuthProvider,
  AuthContext,
} from "./context/AuthContext";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyApplications from "./pages/MyApplications";
import PostJob from "./pages/PostJob";
import Dashboard from "./pages/Dashboard";
import ApplyJob from "./pages/ApplyJob";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Profile from "./pages/Profile";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  return user
    ? children
    : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="jobPortalRootWrapper">
          <Navbar />

          <main className="jobPortalMainContent">
            <Routes>

              {/* PUBLIC */}

              <Route
                path="/"
                element={<Home />}
              />

              <Route
                path="/jobs"
                element={<Jobs />}
              />

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/register"
                element={<Register />}
              />

              {/* PROFILE */}

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              {/* RECRUITER */}

              <Route
                path="/recruiter-dashboard"
                element={
                  <PrivateRoute>
                    <RecruiterDashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/post-job"
                element={
                  <PrivateRoute>
                    <PostJob />
                  </PrivateRoute>
                }
              />

              <Route
                path="/post-job/:id"
                element={
                  <PrivateRoute>
                    <PostJob />
                  </PrivateRoute>
                }
              />

              {/* JOB SEEKER */}

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/my-applications"
                element={
                  <PrivateRoute>
                    <MyApplications />
                  </PrivateRoute>
                }
              />

              <Route
                path="/apply-job/:jobId"
                element={
                  <PrivateRoute>
                    <ApplyJob />
                  </PrivateRoute>
                }
              />

              {/* 404 */}

              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />

            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Logged-in User
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");

      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (error) {
      console.error("Fetch User Error:", error);
      logout(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Register User
  const register = async (userData) => {
    try {
      const res = await api.post("/auth/register", userData);

      return {
        success: true,
        message: res.data?.message || "Registration Successful",
      };
    } catch (error) {
      console.error("Register Error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Registration Failed",
      };
    }
  };

  // Login User
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);

        if (res.data.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(res.data.user)
          );
          setUser(res.data.user);
        }

        return {
          success: true,
        };
      }

      return {
        success: false,
        message: "Invalid response from server",
      };
    } catch (error) {
      console.error("Login Error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Login Failed",
      };
    }
  };

  // Update User Context
  const updateUserContext = (updatedData) => {
    setUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        ...updatedData,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      return updatedUser;
    });
  };

  // Logout User
  const logout = (redirect = true) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    if (redirect) {
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateUserContext,
      }}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "#020617",
            color: "#fff",
            fontSize: "18px",
          }}
        >
          Loading Application...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
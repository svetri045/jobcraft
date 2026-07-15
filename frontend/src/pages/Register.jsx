import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./styles/Register.css";

function Register() {
  const [registerUserRole, setRegisterUserRole] =
    useState("seeker");

  const [registerEmail, setRegisterEmail] =
    useState("");

  const [registerPassword, setRegisterPassword] =
    useState("");

  const [registerFullName, setRegisterFullName] =
    useState("");

  const [registerCompanyName, setRegisterCompanyName] =
    useState("");

  const [registerCompanyDetails, setRegisterCompanyDetails] =
    useState("");

  const { register } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const registerUserData = {
      email: registerEmail,
      password: registerPassword,
      role: registerUserRole,

      name:
        registerUserRole === "seeker"
          ? registerFullName
          : registerCompanyName,

      companyName:
        registerUserRole === "recruiter"
          ? registerCompanyName
          : "",

      companyDescription:
        registerUserRole === "recruiter"
          ? registerCompanyDetails
          : "",
    };

    console.log(
      "Register Data:",
      registerUserData
    );

    const result =
      await register(registerUserData);

    if (result && result.success) {
      alert(
        "✅ Registration Successful! Please login."
      );

      navigate("/login");
    } else {
      alert(
        "❌ " +
          (result?.message ||
            "Registration failed!")
      );
    }
  };

  return (
    <div className="registerPageWrapper">
      <div className="registerPageCard">
        <h2 className="registerPageTitle">
          📝 Create Account
        </h2>

        <form
          className="registerPageForm"
          onSubmit={handleRegisterSubmit}
        >
          <div className="registerPageInputGroup">
            <label>
              I am a...
            </label>

            <select
              className="registerPageSelectField"
              value={registerUserRole}
              onChange={(event) =>
                setRegisterUserRole(
                  event.target.value
                )
              }
            >
              <option value="seeker">
                Job Seeker
              </option>

              <option value="recruiter">
                Recruiter
              </option>
            </select>
          </div>

          {registerUserRole === "seeker" ? (
            <div className="registerPageInputGroup">
              <label>
                Full Name
              </label>

              <input
                className="registerPageInputField"
                type="text"
                value={registerFullName}
                onChange={(event) =>
                  setRegisterFullName(
                    event.target.value
                  )
                }
                required
              />
            </div>
          ) : (
            <>
              <div className="registerPageInputGroup">
                <label>
                  Company Name
                </label>

                <input
                  className="registerPageInputField"
                  type="text"
                  value={registerCompanyName}
                  onChange={(event) =>
                    setRegisterCompanyName(
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="registerPageInputGroup">
                <label>
                  Company Website / Location
                </label>

                <input
                  className="registerPageInputField"
                  type="text"
                  value={registerCompanyDetails}
                  onChange={(event) =>
                    setRegisterCompanyDetails(
                      event.target.value
                    )
                  }
                  required
                />
              </div>
            </>
          )}

          <div className="registerPageInputGroup">
            <label>
              Email Address
            </label>

            <input
              className="registerPageInputField"
              type="email"
              value={registerEmail}
              onChange={(event) =>
                setRegisterEmail(
                  event.target.value
                )
              }
              required
            />
          </div>

          <div className="registerPageInputGroup">
            <label>
              Password
            </label>

            <input
              className="registerPageInputField"
              type="password"
              value={registerPassword}
              onChange={(event) =>
                setRegisterPassword(
                  event.target.value
                )
              }
              required
            />
          </div>

          <button
            type="submit"
            className="registerPageSubmitButton"
          >
            Register as{" "}
            {registerUserRole === "seeker"
              ? "Job Seeker"
              : "Recruiter"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import "./styles/Profile.css";

function Profile() {
  const { user, updateUserContext } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    education: "",
    profilePic: "",
    companyName: "",
    companyWebsite: "",
    companyDescription: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        skills: Array.isArray(user.skills)
          ? user.skills.join(", ")
          : user.skills || "",
        education: user.education || "",
        profilePic: user.profilePic || "",
        companyName: user.companyName || "",
        companyWebsite: user.companyWebsite || "",
        companyDescription: user.companyDescription || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const userId = user?._id || user?.id;

      const payload = {
        ...formData,
        skills:
          user.role === "jobseeker"
            ? formData.skills
                .split(",")
                .map((skill) => skill.trim())
            : [],
      };

      const response = await api.put(
        `/auth/update/${userId}`,
        payload
      );

      updateUserContext(response.data.user);

      alert("✅ Profile updated successfully!");

      setIsEditing(false);
    } catch (err) {
      console.error("Update Error:", err);

      alert(
        err.response?.data?.message ||
          "Update failed!"
      );
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePic: reader.result,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const jobSeekerFields = [
    "name",
    "email",
    "phone",
    "skills",
    "education",
  ];

  const recruiterFields = [
    "name",
    "email",
    "companyName",
    "companyWebsite",
    "companyDescription",
  ];

  const fields =
    user?.role === "recruiter"
      ? recruiterFields
      : jobSeekerFields;

  return (
    <div className="profilePageWrapper">
      <div className="profileCard">
        <h2 className="profileTitle">
          {user?.role === "recruiter"
            ? "🏢 Recruiter Profile"
            : "👤 Job Seeker Profile"}
        </h2>

        <div className="profileImageSection">
          <img
            src={
              formData.profilePic ||
              `https://ui-avatars.com/api/?name=${
                formData.name || "User"
              }`
            }
            alt="Profile"
            className="profileImage"
          />

          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="profileFileInput"
            />
          )}
        </div>

        {fields.map((field) => (
          <div
            className="profileFieldGroup"
            key={field}
          >
            <label className="profileLabel">
              {field}
            </label>

            {isEditing ? (
              <input
                className="profileInput"
                value={formData[field]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [field]: e.target.value,
                  })
                }
              />
            ) : (
              <div className="profileValueBox">
                {formData[field] || "Not Provided"}
              </div>
            )}
          </div>
        ))}

        <button
          className="profileActionButton"
          onClick={
            isEditing
              ? handleSave
              : () => setIsEditing(true)
          }
        >
          {isEditing
            ? "Save Changes"
            : "Edit Profile"}
        </button>
      </div>
    </div>
  );
}

export default Profile;
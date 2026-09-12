import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Profile() {
  const { user, login, token, logout } = useAuth();

  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/users/profile");

        const userData = response.data.user;

        setProfile(userData);

        setFormData({
          name: userData.name,
          email: userData.email
        });
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
          "Failed to fetch profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setMessage("");
      setError("");

      const response = await api.put(
        "/users/profile",
        formData
      );

      const updatedUser = response.data.user;

      setProfile(updatedUser);

      login(token, updatedUser);

      setMessage("Profile updated successfully");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to update profile"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      setChangingPassword(true);
      setMessage("");
      setError("");

      const response = await api.put(
        "/users/change-password",
        passwordData
      );

      setMessage(
        response.data.message ||
        "Password changed successfully"
      );

      setPasswordData({
        currentPassword: "",
        newPassword: ""
      });
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to change password"
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.delete("/users/account");

      logout();

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to delete account"
      );
    }
  };

  if (loading) {
    return <h2>Loading profile...</h2>;
  }

  if (error && !profile) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>My Profile</h1>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}

      <hr />

      <h2>Profile Information</h2>

      <form onSubmit={handleUpdateProfile}>
        <div>
          <label>Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleProfileChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleProfileChange}
            required
          />
        </div>

        <br />

        <p>
          Role: {profile?.role}
        </p>

        <button
          type="submit"
          disabled={updating}
        >
          {updating
            ? "Updating..."
            : "Update Profile"}
        </button>
      </form>

      <hr />

      <h2>Change Password</h2>

      <form onSubmit={handleChangePassword}>
        <div>
          <label>Current Password</label>

          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <br />

        <div>
          <label>New Password</label>

          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={changingPassword}
        >
          {changingPassword
            ? "Changing..."
            : "Change Password"}
        </button>
      </form>

      <hr />

      <h2>Delete Account</h2>

      <p>
        This will deactivate your account.
      </p>

      <button onClick={handleDeleteAccount}>
        Delete Account
      </button>
    </div>
  );
}

export default Profile;
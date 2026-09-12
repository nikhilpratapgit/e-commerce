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
    return (
      <main className="profile-page">
        <div className="profile-state">
          <h2>Loading profile...</h2>
        </div>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="profile-page">
        <div className="profile-state">
          <h2>{error}</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile?.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h1>My Profile</h1>
          <p>Manage your account information and security.</p>
        </div>
      </div>

      {message && (
        <div className="profile-success">
          {message}
        </div>
      )}

      {error && (
        <div className="profile-error">
          {error}
        </div>
      )}

      <div className="profile-layout">
        <section className="profile-card">
          <div className="profile-card-header">
            <div>
              <h2>Profile Information</h2>
              <p>Update your personal information.</p>
            </div>

            <span className="profile-role">
              {profile?.role}
            </span>
          </div>

          <form onSubmit={handleUpdateProfile}>
            <div className="profile-form-grid">
              <div className="profile-field">
                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="profile-field">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>
            </div>

            <div className="profile-form-actions">
              <button
                type="submit"
                disabled={updating}
              >
                {updating
                  ? "Updating..."
                  : "Update Profile"}
              </button>
            </div>
          </form>
        </section>

        <section className="profile-card">
          <div className="profile-card-header">
            <div>
              <h2>Change Password</h2>
              <p>Keep your account secure with a strong password.</p>
            </div>

            <span className="security-icon">🔒</span>
          </div>

          <form onSubmit={handleChangePassword}>
            <div className="profile-password-fields">
              <div className="profile-field">
                <label>Current Password</label>

                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="profile-field">
                <label>New Password</label>

                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>

            <div className="profile-form-actions">
              <button
                type="submit"
                disabled={changingPassword}
              >
                {changingPassword
                  ? "Changing..."
                  : "Change Password"}
              </button>
            </div>
          </form>
        </section>

        <section className="profile-card danger-card">
          <div className="profile-card-header">
            <div>
              <h2>Delete Account</h2>
              <p>
                Deactivate your account and remove access to
                your account.
              </p>
            </div>

            <span className="danger-icon">⚠️</span>
          </div>

          <div className="delete-account-content">
            <p>
              This action will deactivate your account.
              Make sure you really want to continue.
            </p>

            <button
              className="delete-account-button"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;
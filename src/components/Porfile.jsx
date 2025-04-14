"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import userService from "../services/userService"
import authService from "../services/authService"
import "./CSS/Profile.css"

const Profile = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("profile")

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    bio: "",
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Success message state
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await userService.getProfile()
        setUser(userData)
        setProfileForm({
          name: userData.name || "",
          email: userData.email || "",
          bio: userData.bio || "",
        })
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching user profile:", err)
        setError("Failed to load user profile")
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileForm({
      ...profileForm,
      [name]: value,
    })
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")

    try {
      await userService.updateProfile(profileForm)
      setSuccessMessage("Profile updated successfully")

      // Update local user data
      const currentUser = authService.getCurrentUser()
      if (currentUser) {
        const updatedUser = { ...currentUser, name: profileForm.name }
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(err.response?.data?.message || "Failed to update profile")
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    try {
      await userService.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })

      setSuccessMessage("Password updated successfully")

      // Reset password form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err) {
      console.error("Error updating password:", err)
      setError(err.response?.data?.message || "Failed to update password")
    }
  }

  if (isLoading) {
    return <div className="loading">Loading profile...</div>
  }

  if (error && !user) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <Link to="/dashboard" className="back-button">
          <span className="icon-arrow-left"></span>
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Information
          </button>
          <button
            className={`tab-button ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </button>
        </div>

        {successMessage && <div className="success-message">{successMessage}</div>}

        {error && <div className="error-message">{error}</div>}

        {activeTab === "profile" && (
          <div className="profile-form-container">
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  required
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  rows={4}
                  placeholder="Tell us about yourself"
                ></textarea>
              </div>

              <button type="submit" className="submit-button">
                Save Changes
              </button>
            </form>
          </div>
        )}

        {activeTab === "password" && (
          <div className="password-form-container">
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="8"
                />
              </div>

              <button type="submit" className="submit-button">
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

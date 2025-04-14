import { Link, useLocation } from "react-router-dom"
import "./CSS/Sidebar.css"

const Sidebar = () => {
  const location = useLocation()

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-text">AnalyticsFAQ</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Main</h3>
          <ul className="nav-items">
            <li className="nav-item">
              <Link to="/dashboard" className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}>
                <span className="icon-chart"></span>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/chat" className={`nav-link ${location.pathname === "/chat" ? "active" : ""}`}>
                <span className="icon-message"></span>
                <span>Chat Interface</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Management</h3>
          <ul className="nav-items">
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <span className="icon-file"></span>
                <span>FAQ Management</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <span className="icon-users"></span>
                <span>Resume Analysis</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Account</h3>
          <ul className="nav-items">
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <span className="icon-user"></span>
                <span>Profile</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <span className="icon-bell"></span>
                <span>Notifications</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <span className="icon-settings"></span>
                <span>Settings</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <span className="icon-help"></span>
                <span>Help & Support</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        <Link to="#" className="logout-button">
          <span className="icon-logout"></span>
          <span>Logout</span>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar

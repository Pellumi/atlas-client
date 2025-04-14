import { useState } from "react"
import { Link } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import "./CSS/Dashboard.css"

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for dashboard
  const faqStats = {
    totalQuestions: 245,
    answeredQuestions: 230,
    categories: 12,
    topQuestions: [
      { id: 1, question: "How do I reset my password?", count: 87 },
      { id: 2, question: "What are the pricing plans?", count: 64 },
      { id: 3, question: "How to export my data?", count: 52 },
      { id: 4, question: "Can I cancel my subscription?", count: 43 },
      { id: 5, question: "How to contact support?", count: 38 },
    ],
    categoryDistribution: [
      { name: "Account", percentage: 35 },
      { name: "Billing", percentage: 25 },
      { name: "Features", percentage: 20 },
      { name: "Technical", percentage: 15 },
      { name: "Other", percentage: 5 },
    ],
  }

  const resumeStats = {
    totalResumes: 156,
    analyzedToday: 24,
    pendingAnalysis: 8,
    recentResumes: [
      { id: 1, name: "John Smith", position: "Software Engineer", status: "Analyzed", date: "2 hours ago", score: 85 },
      { id: 2, name: "Sarah Johnson", position: "Product Manager", status: "Analyzed", date: "4 hours ago", score: 92 },
      { id: 3, name: "Michael Brown", position: "UX Designer", status: "Pending", date: "6 hours ago", score: null },
      { id: 4, name: "Emily Davis", position: "Data Scientist", status: "Pending", date: "8 hours ago", score: null },
      {
        id: 5,
        name: "Alex Wilson",
        position: "Marketing Specialist",
        status: "Analyzed",
        date: "10 hours ago",
        score: 78,
      },
    ],
    skillsDistribution: [
      { name: "Technical", count: 68 },
      { name: "Management", count: 42 },
      { name: "Communication", count: 35 },
      { name: "Design", count: 28 },
      { name: "Analytics", count: 22 },
    ],
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">Analytics Dashboard</h1>
            <div className="dashboard-tabs">
              <button
                className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`tab-button ${activeTab === "faq" ? "active" : ""}`}
                onClick={() => setActiveTab("faq")}
              >
                FAQ Analytics
              </button>
              <button
                className={`tab-button ${activeTab === "resume" ? "active" : ""}`}
                onClick={() => setActiveTab("resume")}
              >
                Resume Analysis
              </button>
            </div>
          </div>

          <div className="header-actions">
            <div className="search-container">
              <span className="search-icon"></span>
              <input type="text" placeholder="Search..." className="search-input" />
            </div>
            <Link to="/chat" className="chat-button">
              <span className="icon-message"></span>
              <span>Open Chat</span>
            </Link>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === "overview" && (
            <>
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-icon faq-icon">
                    <span className="icon-file"></span>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-title">Total FAQ Questions</h3>
                    <div className="stat-value">{faqStats.totalQuestions}</div>
                    <div className="stat-comparison">
                      <span className="icon-trend-up"></span>
                      <span className="positive">+12%</span> from last month
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon resume-icon">
                    <span className="icon-users"></span>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-title">Total Resumes</h3>
                    <div className="stat-value">{resumeStats.totalResumes}</div>
                    <div className="stat-comparison">
                      <span className="icon-trend-up"></span>
                      <span className="positive">+24%</span> from last month
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon analysis-icon">
                    <span className="icon-chart"></span>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-title">Analyzed Today</h3>
                    <div className="stat-value">{resumeStats.analyzedToday}</div>
                    <div className="stat-comparison">
                      <span className="icon-clock"></span>
                      <span>Last: 35 minutes ago</span>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon pending-icon">
                    <span className="icon-pie-chart"></span>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-title">Pending Analysis</h3>
                    <div className="stat-value">{resumeStats.pendingAnalysis}</div>
                    <div className="stat-comparison">
                      <span className="icon-clock"></span>
                      <span>Oldest: 8 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-sections">
                <div className="dashboard-card">
                  <div className="card-header">
                    <h2 className="card-title">Top FAQ Questions</h2>
                    <button className="view-all-button">
                      View All <span className="icon-arrow-up-right"></span>
                    </button>
                  </div>
                  <div className="card-content">
                    <div className="faq-list">
                      {faqStats.topQuestions.map((question) => (
                        <div key={question.id} className="faq-item">
                          <div className="faq-question">{question.question}</div>
                          <div className="faq-count">{question.count} views</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="card-header">
                    <h2 className="card-title">Recent Resume Analysis</h2>
                    <button className="view-all-button">
                      View All <span className="icon-arrow-up-right"></span>
                    </button>
                  </div>
                  <div className="card-content">
                    <div className="resume-list">
                      {resumeStats.recentResumes.map((resume) => (
                        <div key={resume.id} className="resume-item">
                          <div className="resume-info">
                            <div className="resume-name">{resume.name}</div>
                            <div className="resume-position">{resume.position}</div>
                          </div>
                          <div className="resume-meta">
                            {resume.score !== null ? (
                              <div
                                className="resume-score"
                                style={{
                                  "--score-color":
                                    resume.score >= 90
                                      ? "#10b981"
                                      : resume.score >= 80
                                        ? "#3b82f6"
                                        : resume.score >= 70
                                          ? "#f59e0b"
                                          : "#ef4444",
                                }}
                              >
                                {resume.score}
                              </div>
                            ) : (
                              <div className="resume-status pending">Pending</div>
                            )}
                            <div className="resume-date">{resume.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "faq" && (
            <div className="faq-analytics">
              <div className="analytics-header">
                <h2>FAQ System Analytics</h2>
                <div className="time-filter">
                  <button className="time-button active">Last 7 days</button>
                  <button className="time-button">Last 30 days</button>
                  <button className="time-button">Last 90 days</button>
                </div>
              </div>

              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3 className="analytics-title">Category Distribution</h3>
                  <div className="category-chart">
                    {faqStats.categoryDistribution.map((category, index) => (
                      <div key={index} className="category-item">
                        <div className="category-info">
                          <div className="category-name">{category.name}</div>
                          <div className="category-percentage">{category.percentage}%</div>
                        </div>
                        <div className="category-bar-container">
                          <div className="category-bar" style={{ width: `${category.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="analytics-card">
                  <h3 className="analytics-title">FAQ Performance</h3>
                  <div className="performance-stats">
                    <div className="performance-stat">
                      <div className="performance-label">Avg. Response Time</div>
                      <div className="performance-value">1.2s</div>
                    </div>
                    <div className="performance-stat">
                      <div className="performance-label">Satisfaction Rate</div>
                      <div className="performance-value">92%</div>
                    </div>
                    <div className="performance-stat">
                      <div className="performance-label">Resolution Rate</div>
                      <div className="performance-value">87%</div>
                    </div>
                    <div className="performance-stat">
                      <div className="performance-label">Escalation Rate</div>
                      <div className="performance-value">8%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "resume" && (
            <div className="resume-analytics">
              <div className="analytics-header">
                <h2>Resume Analysis System</h2>
                <div className="time-filter">
                  <button className="time-button active">Last 7 days</button>
                  <button className="time-button">Last 30 days</button>
                  <button className="time-button">Last 90 days</button>
                </div>
              </div>

              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3 className="analytics-title">Skills Distribution</h3>
                  <div className="skills-chart">
                    {resumeStats.skillsDistribution.map((skill, index) => (
                      <div key={index} className="skill-item">
                        <div className="skill-info">
                          <div className="skill-name">{skill.name}</div>
                          <div className="skill-count">{skill.count}</div>
                        </div>
                        <div className="skill-bar-container">
                          <div
                            className="skill-bar"
                            style={{ width: `${(skill.count / resumeStats.skillsDistribution[0].count) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="analytics-card">
                  <h3 className="analytics-title">Analysis Performance</h3>
                  <div className="performance-stats">
                    <div className="performance-stat">
                      <div className="performance-label">Avg. Analysis Time</div>
                      <div className="performance-value">45s</div>
                    </div>
                    <div className="performance-stat">
                      <div className="performance-label">Accuracy Rate</div>
                      <div className="performance-value">94%</div>
                    </div>
                    <div className="performance-stat">
                      <div className="performance-label">Avg. Score</div>
                      <div className="performance-value">82/100</div>
                    </div>
                    <div className="performance-stat">
                      <div className="performance-label">Rejection Rate</div>
                      <div className="performance-value">18%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard

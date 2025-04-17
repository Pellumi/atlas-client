import { Link } from "react-router-dom";
import "./CSS/Home.css";

const Home = () => {
  const handleFaq = () => {
    localStorage.setItem("redirectAfterLogin", "/chat");
  };

  const handleCareer = () => {
    localStorage.setItem("redirectAfterLogin", "/resume-guidance");
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <h1 className="home-title">FAQ Chatbot & Career Guidance System</h1>
          <p className="home-description">
            An intelligent platform that combines AI-powered FAQ assistance with
            advanced career guidance capabilities.
          </p>
          <div className="home-actions">
            <Link
              to="/resume-guidance"
              className="primary-button"
              onClick={() => handleCareer()}
            >
              <span className="icon-chart"></span>
              <span>Career Guidance</span>
            </Link>
            <Link
              to="/chat"
              className="secondary-button"
              onClick={() => handleFaq()}
            >
              <span className="icon-message"></span>
              <span>FAQs Chat Interface</span>
            </Link>
          </div>
        </div>

        <div className="features-section">
          <h2 className="features-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <span className="icon-message"></span>
              </div>
              <h3 className="feature-title">AI-Powered FAQ Chatbot</h3>
              <p className="feature-description">
                Intelligent chatbot that provides instant answers to frequently
                asked questions, learning from each interaction.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <span className="icon-file"></span>
              </div>
              <h3 className="feature-title">Resume Analysis</h3>
              <p className="feature-description">
                Advanced AI that analyzes resumes, extracts key information, and
                provides scoring based on job requirements.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <span className="icon-chart"></span>
              </div>
              <h3 className="feature-title">Career Guidance</h3>
              <p className="feature-description">
                {" "}
                By aligning personal strengths with market demands, Atlas
                empowers individuals to make informed decisions, adapt to
                change, and pursue fulfilling paths with clarity and confidence.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <span className="icon-users"></span>
              </div>
              <h3 className="feature-title">User Management</h3>
              <p className="feature-description">
                User inclusive management and feedback system. Atlas guides the
                users through every step of the way
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

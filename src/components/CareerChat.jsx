import { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import resumeGuidanceService from "../services/resumeGuidanceService";
import careerProfileService from "../services/careerProfileService";
import "./CSS/ResumeGuidance.css";
import ReactMarkdown from "react-markdown";
import { convertToReadableDateTime } from "../utiils/minorUtils";
const CareerChat = () => {
  const { conversationId: urlConvId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversationTitle, setConversationTitle] = useState("New guidance");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [careerProfile, setCareerProfile] = useState(null);
  const [useProfileResume, setUseProfileResume] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // "chat" or "profile"
  const [conversationType, setConversationType] = useState("resume"); // "resume" or "career"

  const messagesEndRef = useRef(null);

  // Fetch list of conversations and career profile
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch conversations
        const convData = await resumeGuidanceService.getConversations();
        const convs = Array.isArray(convData)
          ? convData.map(({ _id, title, created_at }) => ({
              id: _id,
              title: title || "Untitled conversation",
              date: created_at || new Date().toISOString(),
              // We'll determine the type based on the title or other metadata
              // For now, we'll assume all are general conversations
              type: title?.toLowerCase().includes("career")
                ? "career"
                : "resume",
            }))
          : [];
        setConversations(convs);

        // Fetch career profile
        try {
          const profileData = await careerProfileService.getProfile();
          setCareerProfile(profileData);
        } catch (profileErr) {
          console.log("No career profile found or error fetching profile");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load guidance data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-select if URL has an ID
  useEffect(() => {
    if (urlConvId && conversations.length) {
      const found = conversations.find((c) => c.id === urlConvId);
      if (found) {
        selectConversation(urlConvId);
        setConversationType(found.type || "resume");
      } else {
        navigate("/resume-guidance", { replace: true });
      }
    }
  }, [urlConvId, conversations, navigate]);

  // Scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => setInput(e.target.value);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setUseProfileResume(false);
    }
  };

  const toggleUseProfileResume = () => {
    setUseProfileResume(!useProfileResume);
    if (!useProfileResume) {
      setResumeFile(null);
    }
  };

  // Start a brand-new chat
  const startNewChat = (type = "resume") => {
    setActiveConversation(null);
    navigate("/resume-guidance");
    setMessages([]);
    setResumeFile(null);
    setUseProfileResume(false);
    setConversationType(type);
    setConversationTitle(
      type === "career" ? "New career guidance" : "New resume guidance"
    );
  };

  const initNewChat = async (question) => {
    if (!question.trim() && !resumeFile && !useProfileResume) return;
    setIsLoading(true);
    try {
      // Create a new conversation
      const resp = await resumeGuidanceService.createConversation(
        question.trim(),
        resumeFile,
        useProfileResume
      );

      // Add to sidebar
      const newConv = {
        id: resp.conversation_id,
        title: resp.conversation_title || question.trim().substring(0, 30),
        date: new Date().toISOString(),
        type: conversationType,
      };
      setConversations((prev) => [newConv, ...prev]);

      // Set active conversation
      setActiveConversation(resp.conversation_id);
      setConversationTitle(
        resp.conversation_title || question.trim().substring(0, 30)
      );

      // Format messages
      if (resp.messages && resp.messages.length > 0) {
        const firstMessage = resp.messages[0];
        setMessages([
          {
            id: `q-${resp.conversation_id}`,
            role: "user",
            content: firstMessage.question,
            hasFile: !!resumeFile || useProfileResume,
          },
          {
            id: `a-${resp.conversation_id}`,
            role: "assistant",
            content: firstMessage.answer,
            resources: firstMessage.resources || [],
            resumeRetouch: firstMessage.resumeRetouch || null,
            type: firstMessage.type || [],
          },
        ]);
      }

      navigate(`/resume-guidance/${resp.conversation_id}`, { replace: true });
      setResumeFile(null);
      setUseProfileResume(false);
    } catch (err) {
      console.error(err);
      setError(
        `Failed to create new ${conversationType} guidance conversation`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load an existing conversation + its messages
  const selectConversation = async (id) => {
    setIsLoading(true);
    try {
      const convData = await resumeGuidanceService.getConversation(id);

      // Set the conversation type based on the conversation data
      // For now, we'll use the title to determine the type
      const conv = conversations.find((c) => c.id === id);
      const type =
        conv?.type ||
        (conv?.title?.toLowerCase().includes("career") ? "career" : "resume");
      setConversationType(type);

      // Format messages
      const msgsArray = convData.messages || [];
      const chatMsgs = msgsArray.flatMap((msg) => [
        {
          id: `q-${msg.id}`,
          role: "user",
          content: msg.question,
          hasFile: msg.hasFile || false,
        },
        {
          id: `a-${msg.id}`,
          role: "assistant",
          content: msg.answer,
          resources: msg.resources || [],
          resumeRetouch: msg.resumeRetouch || null,
          type: msg.type || [],
        },
      ]);

      setMessages(chatMsgs);
      setActiveConversation(id);

      const sidebarConv = conversations.find((c) => c.id === id);
      setConversationTitle(
        sidebarConv?.title || convData.conversation_title || "Guidance"
      );

      navigate(`/resume-guidance/${id}`, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Failed to load conversation");
    } finally {
      setIsLoading(false);
    }
  };

  // Send a new message to an existing conversation
  const sendMessage = async (convId, content) => {
    if (!convId) {
      setError("No conversation selected");
      return;
    }
    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        role: "user",
        content,
        hasFile: !!resumeFile || useProfileResume,
        pending: true,
      },
    ]);
    setInput("");

    try {
      const resp = await resumeGuidanceService.sendMessage(
        convId,
        content,
        resumeFile,
        useProfileResume
      );

      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setMessages((prev) => [
        ...prev,
        {
          id: `u-${Date.now()}`,
          role: "user",
          content,
          hasFile: !!resumeFile || useProfileResume,
        },
        {
          id: `r-${Date.now()}`,
          role: "assistant",
          content: resp.answer,
          resources: resp.resources || [],
          resumeRetouch: resp.resumeRetouch || null,
          type: resp.type || [],
        },
      ]);

      // Update conversation in sidebar
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                preview:
                  content.slice(0, 30) + (content.length > 30 ? "..." : ""),
                date: new Date().toISOString(),
              }
            : c
        );
        const idx = updated.findIndex((c) => c.id === convId);
        if (idx > -1) {
          const [moved] = updated.splice(idx, 1);
          updated.unshift(moved);
        }
        return updated;
      });

      setResumeFile(null);
      setUseProfileResume(false);
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setError("Failed to send message");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !resumeFile && !useProfileResume) return;

    if (!activeConversation) {
      await initNewChat(input);
    } else {
      await sendMessage(activeConversation, input.trim());
    }
  };

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const giveFeedback = async (id, positive) => {
    try {
      await resumeGuidanceService.provideFeedback(
        id,
        positive ? "positive" : "negative"
      );
      setFeedbackGiven((prev) => ({
        ...prev,
        [id]: positive ? "positive" : "negative",
      }));
    } catch {
      setError("Failed to submit feedback");
    }
  };

  const handleSuggestedQuestion = (q) => {
    setInput(q);
    document.querySelector(".resume-guidance-input");
  };

  const handleProfileUpdate = async (formData) => {
    try {
      const updatedProfile = await careerProfileService.updateProfile(formData);
      setCareerProfile(updatedProfile);
      return true;
    } catch (err) {
      console.error("Error updating profile:", err);
      return false;
    }
  };

  // Sort conversations by date
  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-guidance-container">
      {/* Sidebar */}
      <div
        className={`resume-guidance-sidebar ${showSidebar ? "open" : "closed"}`}
      >
        <div className="sidebar-header">
          <div>
            <h2>Guidance Sessions</h2>
            <button onClick={toggleSidebar} className="toggle-sidebar-button">
              <span
                className={`icon-arrow-left ${
                  !showSidebar ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          <div className="new-chat-buttons">
            {/*             <button className="new-chat-button" onClick={() => startNewChat("resume")}>
              <span className="icon-plus" /> New Resume Session
            </button>
 */}{" "}
            <button
              className="new-career-button"
              onClick={() => startNewChat("career")}
            >
              <span className="icon-briefcase" /> New Career Guidance Session
            </button>
          </div>
        </div>
        <div className="conversations-list">
          {isLoading && !sortedConversations.length ? (
            <div className="loading-conversations">Loading sessions...</div>
          ) : !sortedConversations.length ? (
            <div className="no-conversations">
              <p>No guidance sessions yet</p>
              <div className="new-chat-buttons">
                <button
                  className="new-career-button"
                  onClick={() => startNewChat("career")}
                >
                  Start Career Guidance Session
                </button>
              </div>
            </div>
          ) : (
            sortedConversations.map((c) => (
              <div
                key={c.id}
                className={`conversation-item ${
                  activeConversation === c.id ? "active" : ""
                }`}
                onClick={() => selectConversation(c.id)}
              >
                <div
                  className="conversation-icon"
                  style={{
                    backgroundColor:
                      c.type === "career" ? "#10b981" : "#3b82f6",
                  }}
                >
                  <span
                    className={
                      c.type === "career" ? "icon-briefcase" : "icon-file-text"
                    }
                  />
                </div>
                <div className="conversation-details">
                  <div className="conversation-title">{c.title}</div>
                  <div className="conversation-preview">{c.preview || ""}</div>
                  <div className="conversation-date">
                    {convertToReadableDateTime(c.date)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="sidebar-footer">
          <div className="sidebar-actions">
            <button
              className={`tab-button ${activeTab === "chat" ? "active" : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              <span className="icon-message-square" /> Chat
            </button>
            <button
              className={`tab-button ${
                activeTab === "profile" ? "active" : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <span className="icon-user" /> Profile
            </button>
          </div>
          <Link to="/" className="dashboard-link">
            <span className="icon-arrow-left" /> Back to Home
          </Link>
        </div>
      </div>

      {/* Main guidance area */}
      <div className="resume-guidance-main">
        <header className="resume-guidance-header">
          <div className="header-left">
            <button onClick={toggleSidebar} className="toggle-sidebar-button">
              <span
                className={`icon-arrow-left ${
                  !showSidebar ? "rotate-180" : ""
                }`}
              />
            </button>
            <h1 className="resume-guidance-title">
              {activeTab === "chat" ? conversationTitle : "Career Profile"}
              {conversationType === "career" && activeTab === "chat" && (
                <span className="career-badge">Career</span>
              )}
            </h1>
          </div>
          <div className="header-right">
            {/* {activeTab === "chat" &&
              careerProfile &&
              conversationType === "resume" && (
                <button
                  className={`use-profile-button ${
                    useProfileResume ? "active" : ""
                  }`}
                  onClick={toggleUseProfileResume}
                  title="Use resume from your career profile"
                >
                  <span className="icon-file-text" />
                  {useProfileResume
                    ? "Using Profile Resume"
                    : "Use Profile Resume"}
                </button>
              )} */}
            <Link to="/" className="dashboard-button">
              <span className="icon-arrow-left" /> Home
            </Link>
          </div>
        </header>

        {activeTab === "chat" ? (
          <>
            <div className="messages-container">
              {isLoading && !messages.length ? (
                <div className="loading-messages">Loading guidance...</div>
              ) : !messages.length ? (
                <div className="empty-guidance">
                  <h3>
                    Get personalized{" "}
                    {conversationType === "career" ? "career" : "resume"}{" "}
                    guidance
                  </h3>
                  <div className="resume-guidance-intro">
                    {conversationType === "career" ? (
                      <p>
                        Ask questions about your career path, skills
                        development, or job search strategies.
                      </p>
                    ) : (
                      <>
                        <p>
                          Upload your resume for detailed feedback or ask
                          specific questions about resume writing.
                        </p>
                        {careerProfile && (
                          <div className="profile-resume-notice">
                            <p>
                              <span className="icon-info" /> You have a resume
                              in your career profile. You can use it by toggling
                              "Use Profile Resume" above.
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="suggested-questions">
                    {conversationType === "career"
                      ? [
                          "What career path is best for me with my current skills?",
                          "How can I transition to a software engineering role?",
                          "What skills should I develop for my dream job?",
                          "What volunteer work would benefit my career?",
                        ].map((q) => (
                          <button
                            key={q}
                            onClick={() => handleSuggestedQuestion(q)}
                            className="suggested-question"
                          >
                            {q}
                          </button>
                        ))
                      : [
                          "How can I improve my resume?",
                          "What skills should I highlight for a software developer role?",
                          "How should I format my work experience section?",
                          "What's the best resume format for recent graduates?",
                        ].map((q) => (
                          <button
                            key={q}
                            onClick={() => handleSuggestedQuestion(q)}
                            className="suggested-question"
                          >
                            {q}
                          </button>
                        ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.role}-message ${
                      msg.pending ? "pending" : ""
                    }`}
                  >
                    <div className="message-avatar">
                      {msg.role === "user" ? "You" : "AI"}
                    </div>
                    <div className="message-content-wrapper">
                      <div className="message-content">
                        {msg.hasFile && (
                          <div className="file-attachment">
                            <span className="icon-file-text"></span>
                            <span>
                              {useProfileResume
                                ? "Using profile resume"
                                : "Resume uploaded"}
                            </span>
                          </div>
                        )}
                        <ReactMarkdown>
                          {msg.pending ? "Sending..." : msg.content}
                        </ReactMarkdown>
                      </div>

                      {msg.role === "assistant" && !msg.pending && (
                        <>
                          {/* Resources Section */}
                          {msg.resources && msg.resources.length > 0 && (
                            <div className="career-resources">
                              <h4>Recommended Resources</h4>
                              <ul>
                                {msg.resources.map((resource, index) => (
                                  <li key={index}>
                                    <a
                                      href={resource.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {resource.title} ({resource.type})
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Resume Retouch Section */}
                          {msg.resumeRetouch && (
                            <div className="resume-retouch">
                              <h4>Resume Improvement Suggestion</h4>
                              <div className="retouch-content">
                                <ReactMarkdown>
                                  {msg.resumeRetouch}
                                </ReactMarkdown>
                              </div>
                            </div>
                          )}

                          {/* Advice Types */}
                          {msg.type && msg.type.length > 0 && (
                            <div className="advice-types">
                              {msg.type.map((type, index) => (
                                <span key={index} className="advice-type-tag">
                                  {type.replace(/_/g, " ")}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Feedback Buttons */}
                          <div className="feedback-container">
                            <div className="message-feedback">
                              <button
                                className={`feedback-button ${
                                  feedbackGiven[msg.id] === "positive"
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => giveFeedback(msg.id, true)}
                                aria-label="Thumbs up"
                              >
                                <span className="icon-thumbs-up" />
                              </button>
                              <button
                                className={`feedback-button ${
                                  feedbackGiven[msg.id] === "negative"
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => giveFeedback(msg.id, false)}
                                aria-label="Thumbs down"
                              >
                                <span className="icon-thumbs-down" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="resume-guidance-input-container"
            >
              <div className="resume-guidance-input-wrapper">
                {conversationType === "resume" && (
                  <label htmlFor="resume-upload" className="attachment-button">
                    <span className="icon-paperclip" />
                    <input
                      type="file"
                      id="resume-upload"
                      className="resume-file-input"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      disabled={useProfileResume}
                    />
                  </label>
                )}
                {resumeFile && (
                  <div className="resume-file-preview">
                    <span className="icon-file-text"></span>
                    <span className="file-name">{resumeFile.name}</span>
                    <button
                      type="button"
                      className="remove-file-button"
                      onClick={() => setResumeFile(null)}
                    >
                      <span className="icon-x" />
                    </button>
                  </div>
                )}
                <input
                  className="resume-guidance-input"
                  value={input}
                  onChange={handleInputChange}
                  placeholder={
                    conversationType === "career"
                      ? "Ask about career advice, skills development, or job search..."
                      : "Ask for resume advice or upload a resume..."
                  }
                />
                <button
                  type="submit"
                  className="send-button"
                  disabled={!input.trim() && !resumeFile && !useProfileResume}
                >
                  <span className="icon-send" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <CareerProfileView
            profile={careerProfile}
            onUpdate={handleProfileUpdate}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

// Career Profile View Component
const CareerProfileView = ({ profile, onUpdate, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    current_skills: "",
    experience: "",
    volunteer_work: "",
    education_history: "",
    programme: "",
    education_level: "",
    education_duration: "",
    dream_job: "",
    file: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        current_skills: Array.isArray(profile.current_skills)
          ? profile.current_skills.join("\n")
          : profile.current_skills || "",
        experience: profile.experience || "",
        volunteer_work: profile.volunteer_work || "",
        education_history: profile.education_history || "",
        programme: profile.programme || "",
        education_level: profile.education_level || "",
        education_duration: profile.education_duration || "",
        dream_job: profile.dream_job || "",
        file: null,
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    const submitData = new FormData();
    console.log(formData);

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        submitData.append(
          key,
          typeof value === "number" ? value.toString() : value
        );
      }
    });

    try {
      const success = await onUpdate(submitData);
      if (success) {
        setIsEditing(false);
      } else {
        setSaveError("Failed to save profile. Please try again.");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setSaveError("An error occurred while saving your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-profile">Loading your career profile...</div>
    );
  }

  if (!profile && !isEditing) {
    return (
      <div className="empty-profile">
        <h3>No Career Profile Found</h3>
        <p>
          Create your career profile to enhance your resume guidance experience.
        </p>
        <button
          className="create-profile-button"
          onClick={() => setIsEditing(true)}
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="career-profile-container">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-edit-form">
          <h3>Edit Career Profile</h3>

          {saveError && <div className="save-error">{saveError}</div>}

          <div className="form-group">
            <label htmlFor="programme">Programme</label>
            <input
              type="text"
              id="programme"
              name="programme"
              value={formData.programme}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="education_level">Education Level</label>
            <select
              id="education_level"
              name="education_level"
              value={formData.education_level}
              onChange={handleInputChange}
            >
              <option value="">Select Level</option>
              <option value="first_year">First Year</option>
              <option value="second_year">Second Year</option>
              <option value="third_year">Third Year</option>
              <option value="fourth_year">Fourth Year</option>
              <option value="fifth_year">Third Year</option>
              <option value="sixth_year">Fourth Year</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="education_duration">
              Education Duration (years)
            </label>
            <input
              type="number"
              id="education_duration"
              name="education_duration"
              value={formData.education_duration}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dream_job">Dream Job</label>
            <input
              type="text"
              id="dream_job"
              name="dream_job"
              value={formData.dream_job}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="education_history">Education History</label>
            <textarea
              id="education_history"
              name="education_history"
              value={formData.education_history}
              onChange={handleInputChange}
              rows={4}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="current_skills">Current Skills</label>
            <textarea
              id="current_skills"
              name="current_skills"
              value={formData.current_skills}
              onChange={handleInputChange}
              rows={6}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="experience">Experience</label>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              rows={8}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="volunteer_work">Volunteer Work</label>
            <textarea
              id="volunteer_work"
              name="volunteer_work"
              value={formData.volunteer_work}
              onChange={handleInputChange}
              rows={4}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="resume-file">Resume/CV</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="resume-file"
                name="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              {formData.file && (
                <span className="file-selected">{formData.file.name}</span>
              )}
              {!formData.file && profile?.resume_url && (
                <span className="current-file">
                  Current: {profile.resume_filename || "resume.pdf"}
                </span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-view">
          <div className="profile-header">
            <h3>Career Profile</h3>
            <button
              className="edit-profile-button"
              onClick={() => setIsEditing(true)}
            >
              <span className="icon-edit"></span> Edit Profile
            </button>
          </div>

          <div className="profile-section">
            <h4>Programme</h4>
            <p>{profile.programme || "Not specified"}</p>
          </div>

          <div className="profile-section">
            <h4>Education Level</h4>
            <p>
              {profile.education_level === "first_year" && "First Year"}
              {profile.education_level === "second_year" && "Second Year"}
              {profile.education_level === "third_year" && "Third Year"}
              {profile.education_level === "fourth_year" && "Fourth Year"}
              {profile.education_level === "fifth_year" && "Fourth Year"}
              {profile.education_level === "sixth_year" && "Fourth Year"}
              {profile.education_level === "graduate" && "Graduate"}
              {!profile.education_level && "Not specified"}
            </p>
          </div>

          <div className="profile-section">
            <h4>Education Duration</h4>
            <p>
              {profile.education_duration
                ? `${profile.education_duration} years`
                : "Not specified"}
            </p>
          </div>

          <div className="profile-section">
            <h4>Dream Job</h4>
            <p>{profile.dream_job || "Not specified"}</p>
          </div>

          <div className="profile-section">
            <h4>Education History</h4>
            <div className="profile-text-content">
              {profile.education_history ? (
                <ReactMarkdown>{profile.education_history}</ReactMarkdown>
              ) : (
                <p className="not-specified">Not specified</p>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h4>Current Skills</h4>
            <div className="profile-text-content">
              {Array.isArray(profile.current_skills) &&
              profile.current_skills.length > 0 ? (
                <ReactMarkdown>
                  {profile.current_skills.join("\n")}
                </ReactMarkdown>
              ) : profile.current_skills ? (
                <ReactMarkdown>{profile.current_skills}</ReactMarkdown>
              ) : (
                <p className="not-specified">Not specified</p>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h4>Experience</h4>
            <div className="profile-text-content">
              {profile.experience ? (
                <ReactMarkdown>{profile.experience}</ReactMarkdown>
              ) : (
                <p className="not-specified">Not specified</p>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h4>Volunteer Work</h4>
            <div className="profile-text-content">
              {profile.volunteer_work ? (
                <ReactMarkdown>{profile.volunteer_work}</ReactMarkdown>
              ) : (
                <p className="not-specified">Not specified</p>
              )}
            </div>
          </div>

          {profile.resume_url && (
            <div className="profile-section">
              <h4>Resume/CV</h4>
              <div className="resume-preview">
                <span className="icon-file-text"></span>
                <span>{profile.resume_filename || "resume.pdf"}</span>
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-resume-button"
                >
                  View
                </a>
              </div>
            </div>
          )}

          {/* {profile.resume_text && (
            <div className="profile-section">
              <h4>Resume Text</h4>
              <div className="profile-text-content resume-text-preview">
                <ReactMarkdown>{profile.resume_text}</ReactMarkdown>
              </div>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default CareerChat;

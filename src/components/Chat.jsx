import { useState, useRef, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import chatService from "../services/chatService"
import "./CSS/Chat.css"

const Chat = () => {
  const { conversationId: urlConvId } = useParams()
  const navigate = useNavigate()

  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [conversationTitle, setConversationTitle] = useState("New conversation")
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [showSidebar, setShowSidebar] = useState(true)
  const [feedbackGiven, setFeedbackGiven] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const messagesEndRef = useRef(null)

  // Fetch list of conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true)
      try {
        const data = await chatService.getConversations()
        const convs = data.map(({ _id, title, updated_at }) => ({
          id: _id,
          title,
          date: updated_at
        }))
        setConversations(convs)
      } catch (err) {
        console.error(err)
        setError("Failed to load conversations")
      } finally {
        setIsLoading(false)
      }
    }
    fetchConversations()
  }, [])

  // Auto‑select if URL has an ID
  useEffect(() => {
    if (urlConvId && conversations.length) {
      const found = conversations.find(c => c.id === urlConvId)
      if (found) selectConversation(urlConvId)
      else navigate("/chat", { replace: true })
    }
  }, [urlConvId, conversations, navigate])

  // Scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleInputChange = e => setInput(e.target.value)

  // Start a brand‑new chat (first question → createConversation)
  const startNewChat = ()  => {
    setActiveConversation(null)
navigate("/chat")
setMessages([])
   }

 const initNewChat = async question =>{
  if (!question.trim()) return
  setIsLoading(true)
   try {
     const resp = await chatService.createConversation(question.trim())
     const convId = resp.conversation_id || resp._id
     const convTitle = resp.conversation_title || resp.title

     // Add to sidebar
     setConversations(prev => [
       { id: convId, title: convTitle, date: new Date().toISOString() },
       ...prev
     ])

     setActiveConversation(convId)
     setConversationTitle(convTitle)
     setMessages([
       { id: `q-${convId}`, role: "user", content: resp.question },
       {
         id: `a-${convId}`,
         role: "assistant",
         content: resp.answer,
         tags: resp.tags,
         source: resp.source
       }
     ])

     navigate(`/chat/${convId}`, { replace: true })
   } catch (err) {
     console.error(err)
     setError("Failed to create new conversation")
   } finally {
     setIsLoading(false)
   }

 }

 

  // Load an existing conversation + its messages
  const selectConversation = async id => {
    setIsLoading(true)
    try {
      const convData = await chatService.getConversation(id)

      // Normalize messages array
      let msgsArray = []
      if (Array.isArray(convData.messages)) {
        msgsArray = convData.messages
      } else if (Array.isArray(convData.messages?.messages)) {
        msgsArray = convData.messages.messages
      }

      const chatMsgs = msgsArray.flatMap(msg => [
        { id: `q-${msg.id}`, role: "user", content: msg.question },
        {
          id: `a-${msg.id}`,
          role: "assistant",
          content: msg.answer,
          tags: msg.tags,
          source: msg.source
        }
      ])

      setMessages(chatMsgs)
      setActiveConversation(id)

      const sidebarConv = conversations.find(c => c.id === id)
      setConversationTitle(
        sidebarConv?.title ||
          convData.conversation_title ||
          convData.title ||
          "Conversation"
      )

      navigate(`/chat/${id}`, { replace: true })
    } catch (err) {
      console.error(err)
      setError("Failed to load conversation")
    } finally {
      setIsLoading(false)
    }
  }

  // Send a new message to an existing conversation
  const sendMessage = async (convId, content) => {
    if (!convId) {
      setError("No conversation selected")
      return
    }
    const tempId = `temp-${Date.now()}`
    setMessages(prev => [
      ...prev,
      { id: tempId, role: "user", content, pending: true }
    ])
    setInput("")

    try {
      const resp = await chatService.sendMessage(convId, content)
      setMessages(prev => prev.filter(m => m.id !== tempId))
      setMessages(prev => [
        ...prev,
        { id: `u-${Date.now()}`, role: "user", content },
        {
          id: `r-${Date.now()}`,
          role: "assistant",
          content: resp.answer,
          tags: resp.tags,
          source: resp.source
        }
      ])

      // Bump convo to top + update preview
      setConversations(prev => {
        const updated = prev.map(c =>
          c.id === convId
            ? {
                ...c,
                preview:
                  content.slice(0, 30) + (content.length > 30 ? "..." : ""),
                date: new Date().toISOString()
              }
            : c
        )
        const idx = updated.findIndex(c => c.id === convId)
        if (idx > -1) {
          const [moved] = updated.splice(idx, 1)
          updated.unshift(moved)
        }
        return updated
      })
    } catch (err) {
      console.error(err)
      setMessages(prev => prev.filter(m => m.id !== tempId))
      setError("Failed to send message")
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!input.trim()) return

    if (!activeConversation) {
      await initNewChat(input)
    } else {
      await sendMessage(activeConversation, input.trim())
    }
  }

  const toggleSidebar = () => setShowSidebar(!showSidebar)
  const giveFeedback = async (id, positive) => {
    try {
      await chatService.provideFeedback(id, positive ? "positive" : "negative")
      setFeedbackGiven(prev => ({
        ...prev,
        [id]: positive ? "positive" : "negative"
      }))
    } catch {
      setError("Failed to submit feedback")
    }
  }
  const handleSuggestedQuestion = q => {
    setInput(q)
    document.querySelector(".chat-input")?.focus()
  }

  if (error) {
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
    <div className="chat-container">
      {/* Sidebar */}
      <div className={`chat-sidebar ${showSidebar ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div> 
          <h2>Conversations</h2>
            <button
              onClick={toggleSidebar}
              className="toggle-sidebar-button"
            >
              <span
                className={`icon-arrow-left ${
                  !showSidebar ? "rotate-180" : ""
                }`}
              />
            </button></div>
          <button
            className="new-chat-button"
            onClick={() => startNewChat("Hello!")}
          >
            <span className="icon-plus" /> New chat
          </button>
        </div>
        <div className="conversations-list">
          {isLoading && !conversations.length ? (
            <div className="loading-conversations">
              Loading conversations...
            </div>
          ) : !conversations.length ? (
            <div className="no-conversations">
              <p>No conversations yet</p>
              <button onClick={() => startNewChat("Hello!")}>
                Start a new chat
              </button>
            </div>
          ) : (
            conversations.map(c => (
              <div
                key={c.id}
                className={`conversation-item ${
                  activeConversation === c.id ? "active" : ""
                }`}
                onClick={() => selectConversation(c.id)}
              >
                <div className="conversation-icon">
                  <span className="icon-message-square" />
                </div>
                <div className="conversation-details">
                  <div className="conversation-title">{c.title}</div>
                  <div className="conversation-preview">{c.preview || ""}</div>
                  <div className="conversation-date">{c.date}</div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="sidebar-footer">
          <Link to="/dashboard" className="dashboard-link">
            <span className="icon-arrow-left" /> Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Main chat */}
      <div className="chat-main">
        <header className="chat-header">
          <div className="header-left">
            <button
              onClick={toggleSidebar}
              className="toggle-sidebar-button"
            >
              <span
                className={`icon-arrow-left ${
                  !showSidebar ? "rotate-180" : ""
                }`}
              />
            </button>
            <h1 className="chat-title">{conversationTitle}</h1>
          </div>
          <Link to="/dashboard" className="dashboard-button">
            <span className="icon-arrow-left" /> Dashboard
          </Link>
        </header>

        <div className="messages-container">
          {isLoading && !messages.length ? (
            <div className="loading-messages">Loading messages...</div>
          ) : !messages.length ? (
            <div className="empty-chat">
              <h3>How can I help you today?</h3>
              <div className="suggested-questions">
                {[
                  "How do I reset my password?",
                  "What are the pricing plans?",
                  "How does the resume analysis work?"
                ].map(q => (
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
            messages.map(msg => (
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
                   {/* Source label */}
                   <div className="message-source">
                      Source: {msg.source}
                    </div>
                  <div className="message-content">
                    {msg.pending ? "Sending..." : msg.content}
                  </div>

                  {msg.role === "assistant" && !msg.pending && (
                    <><div className="feedback-container">       
                                          {/* Tags */}
                                          <div className="message-tags">
                        {msg.tags?.map(tag => (
                          <span key={tag} className="tag-badge">
                            {tag}
                          </span>
                        ))}
                      </div>
              
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

        <form onSubmit={handleSubmit} className="chat-input-container">
          <div className="chat-input-wrapper">
            <button
              type="button"
              className="attachment-button"
              aria-label="Attach file"
            >
              <span className="icon-paperclip" />
            </button>
            <input
              className="chat-input"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message here..."
            />
            <button
              type="button"
              className="mic-button"
              aria-label="Voice input"
            >
              <span className="icon-mic" />
            </button>
            <button
              type="submit"
              className="send-button"
              disabled={!input.trim()}
            >
              <span className="icon-send" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Chat

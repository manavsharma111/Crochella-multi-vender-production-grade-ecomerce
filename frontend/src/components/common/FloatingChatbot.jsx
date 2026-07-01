import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, User, Bot, Loader2 } from "lucide-react"
import axios from "axios"
import { useSelector } from "react-redux"

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "ai",
      text: "Hi there! I am Baren, your AI assistant. How can I help you today?",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // We don't extract token from auth state anymore, we'll get it from localStorage
  const { isAuthenticated } = useSelector((state) => state.auth)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [chatHistory, isOpen])

  const handleSendMessage = async (e) => {
    e?.preventDefault()
    if (!message.trim()) return

    const userMsg = message.trim()
    const currentHistory = [...chatHistory]

    // Add user message to UI immediately
    setChatHistory([...currentHistory, { sender: "user", text: userMsg }])
    setMessage("")
    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ai/askAI`,
        { message: userMsg, chatHistory: currentHistory },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          withCredentials: true,
        },
      )

      if (response.data.success) {
        setChatHistory((prev) => [
          ...prev,
          { sender: "ai", text: response.data.message },
        ])
      }
    } catch (error) {
      console.error("AI Chat Error:", error)
      const errorMsg =
        error.response?.status === 401
          ? "Please log in to use the AI Customer Support."
          : "Sorry, I am having trouble connecting right now. Please try again later."

      setChatHistory((prev) => [
        ...prev,
        {
          sender: "ai",
          text: errorMsg,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-[#111111]/90 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-[#ff007f] to-[#aa0055] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">
                    Baren AI
                  </h3>
                  <p className="text-white/80 text-xs">
                    Customer Support Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div
              data-lenis-prevent="true"
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
            >
              {chatHistory.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-1 ${
                        msg.sender === "user"
                          ? "bg-gray-700"
                          : "bg-[#ff007f]/20"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <User className="w-4 h-4 text-gray-300" />
                      ) : (
                        <Bot className="w-4 h-4 text-[#ff007f]" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-2xl ${
                        msg.sender === "user"
                          ? "bg-linear-to-br from-gray-800 to-gray-900 text-white rounded-tr-none border border-gray-700"
                          : "bg-white/5 text-gray-200 rounded-tl-none border border-[#ff007f]/30"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-2 max-w-[85%] flex-row">
                    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-1 bg-[#ff007f]/20">
                      <Bot className="w-4 h-4 text-[#ff007f]" />
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 rounded-tl-none border border-[#ff007f]/30 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-[#ff007f] animate-spin" />
                      <span className="text-sm text-gray-400 italic">
                        Baren is thinking...
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-800 bg-black/40 backdrop-blur-md"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-gray-900/80 border border-gray-700 rounded-full py-3 pl-5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff007f] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#ff007f] hover:bg-[#ff007f]/80 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4 text-white ml-0.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-linear-to-tr from-[#ff007f] to-[#ff4d94] rounded-full shadow-[0_0_20px_rgba(255,0,127,0.4)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(255,0,127,0.6)] transition-shadow relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-7 h-7 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

export default FloatingChatbot

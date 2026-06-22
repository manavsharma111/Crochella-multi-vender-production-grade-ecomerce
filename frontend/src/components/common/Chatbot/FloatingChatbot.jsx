import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { askAIAsync } from '../../../redux/slices/aiSlice'

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am Baren, your personal AI assistant. How can I help you today?' }
  ])
  
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.ai)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, isOpen])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { sender: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    const payload = {
        message: input,
        chatHistory: messages
    }

    const result = await dispatch(askAIAsync(payload))
    
    if (result.meta.requestStatus === 'fulfilled') {
        const responseText = result.payload?.message || result.payload?.data?.message || result.payload || "Sorry, I couldn't understand that."
        setMessages(prev => [...prev, { sender: 'ai', text: responseText }])
    } else {
        const errorText = result.payload || 'Sorry, I am having trouble connecting right now.'
        setMessages(prev => [...prev, { sender: 'ai', text: errorText }])
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute bottom-20 right-0 w-[350px] bg-[#0a0a0a] border-2 border-gray-800 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,0,127,0.15)] flex flex-col"
            style={{ height: '500px', maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
            <div className="bg-[#ff007f] p-4 flex justify-between items-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-transparent to-black/20 z-0"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-widest text-sm">Baren AI</h3>
                  <p className="text-[10px] font-medium opacity-90">Customer Support</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-black/20 p-1.5 rounded-full transition-colors relative z-10">
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] p-3 text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-[#1a1a1a] border border-gray-800 text-white rounded-2xl rounded-tr-sm' 
                        : 'bg-[#ff007f]/10 border border-[#ff007f]/20 text-gray-100 rounded-2xl rounded-tl-sm'
                    }`}
                    style={{ wordBreak: 'break-word' }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#ff007f]/10 border border-[#ff007f]/20 p-3 rounded-2xl rounded-tl-sm flex gap-1 items-center h-10">
                    <span className="w-2 h-2 bg-[#ff007f] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-[#ff007f] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-[#ff007f] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[#0a0a0a] border-t border-gray-800 relative z-10">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-[#111] border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#ff007f] transition-colors"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="bg-[#ff007f] text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#d00068] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send size={16} className={input.trim() && !loading ? "translate-x-0.5" : ""} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#ff007f] hover:bg-[#d00068] text-white rounded-full shadow-[0_0_20px_rgba(255,0,127,0.3)] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-50 relative"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'chat'}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
          </motion.div>
        </AnimatePresence>
      </button>
    </div>
  )
}

export default FloatingChatbot

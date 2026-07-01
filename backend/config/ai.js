const { GoogleGenAI } = require("@google/genai")
const OpenAI = require("openai")
const Groq = require("groq-sdk")
const dotenv = require("dotenv")

dotenv.config()

// Fallback logic for generating AI responses
const generateAIResponse = async (prompt) => {
  // Google Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log("Attempting to use Gemini...")
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      })
      return { provider: "Gemini", text: response.text }
    } catch (error) {
      console.error("Gemini failed:", error.message)
    }
  }

  // Groq (Llama models - very fast)
  if (process.env.GROQ_API_KEY) {
    try {
      console.log("Attempting to use Groq...")
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
      })
      return {
        provider: "Groq",
        text: response.choices[0]?.message?.content || "",
      }
    } catch (error) {
      console.error("Groq failed:", error.message)
    }
  }

  // xAI (Grok) using OpenAI SDK
  if (process.env.XAI_API_KEY) {
    try {
      console.log("Attempting to use Grok (xAI)...")
      const grok = new OpenAI({
        apiKey: process.env.XAI_API_KEY,
        baseURL: "https://api.x.ai/v1",
      })
      const response = await grok.chat.completions.create({
        model: "grok-beta",
        messages: [{ role: "user", content: prompt }],
      })
      return { provider: "Grok", text: response.choices[0].message.content }
    } catch (error) {
      console.error("Grok failed:", error.message)
    }
  }

  // OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      console.log("Attempting to use OpenAI...")
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      const response = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      })
      return { provider: "OpenAI", text: response.choices[0].message.content }
    } catch (error) {
      console.error("OpenAI failed:", error.message)
    }
  }

  throw new Error(
    "All AI providers failed or no API keys were configured in .env file.",
  )
}

module.exports = { generateAIResponse }

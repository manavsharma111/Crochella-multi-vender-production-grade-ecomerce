const { generateAIResponse } = require("../config/ai.js")
const mongoose = require("mongoose")
const Product = require("../models/Product")

// ai customer support
const aiCustomerSupport = async (req, res) => {
  try {
    // message and chat history
    const { message, chatHistory } = req.body

    if (!message) {
      return res.status(400).json({ message: "Please provide a message" })
    }

    // ai instruction
    const aiInstruction = `
        You are Baren, an expert AI customer support assistant for our premium handloom e-commerce website.
        Tone: Extremely helpful, friendly, polite, and quick.
        Core Knowledge:
        - We sell authentic, high-quality traditional handloom products (Sarees, Suits, Dupattas, Fabrics) directly supporting local weavers.
        - Shipping: Takes exactly 5-7 days across India. It is secure and tracked.
        - Return Policy: Allowed ONLY within 7 days from delivery, and ONLY if the product is received damaged or defective.
        
        Navigation Guidance:
        - If they want to browse or buy products, politely guide them to visit our "Product Page".
        - If they want to check their order path, tell them to visit the "Live Tracking Map" on their Dashboard.
        - If they want to raise a complaint or talk to a human, guide them to our "Contact Page".
        
        Behavior Rules:
        - Clear every small, silly, or complex doubt patiently.
        - Always respond in English by default.
        - CRITICAL: If the customer writes in a regional language (like Hindi, Hinglish, Tamil, etc.) or expresses discomfort in English, seamlessly transition and reply perfectly in their chosen regional language/style.
        `

    // for remembering old chat history
    let formattedHistory = ""
    if (chatHistory && Array.isArray(chatHistory)) {
      formattedHistory = chatHistory
        .map(
          (chat) =>
            `${chat.sender === "user" ? "Customer" : "Baren"}: ${chat.text}`,
        )
        .join("\n")
    }

    // for complete information
    const fullPrompt = `
        ${aiInstruction}
        --- Past Conversation History ---
        ${formattedHistory || "No previous conversation."}
        Current Customer Message: ${message}
        Your Response:`

    const response = await generateAIResponse(fullPrompt)

    res.status(200).json({
      success: true,
      provider: response.provider,
      message: response.text,
    })
  } catch (error) {
    console.error("AI Support Engine Error:", error)
    res
      .status(500)
      .json({ message: error.message || "AI Assistant internal server error" })
  }
}

// recemondation system
const getSmartRecommendations = async (req, res) => {
  try {
    const { productId } = req.params

    // Current product details fetch kari taaki similarity score nikal sakein
    const currentProduct = await Product.findById(productId)
    if (!currentProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" })
    }

    // Pricing Boundaries
    const minPrice = currentProduct.price * 0.8 // 20% down
    const maxPrice = currentProduct.price * 1.2 // 20% up

    // MongoDB Aggregation Pipeline Engine
    const recommendedProducts = await Product.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(productId) }, // Same product ko exclude karo
          category: currentProduct.category, // Category strictly match hoe
        },
      },
      {
        // Score System
        $addFields: {
          similarityScore: {
            $size: {
              $setIntersection: [
                { $ifNull: ["$tags", []] },
                currentProduct.tags || [],
              ],
            },
          },
        },
      },
      { $sort: { similarityScore: -1, rating: -1 } }, // Best matched and top-rated at top
      { $limit: 4 }, // recemondation limit
    ])

    // Fallback , any random product
    let finalRecommendations = recommendedProducts
    if (finalRecommendations.length === 0) {
      finalRecommendations = await Product.find().limit(4) // Removed exclusion to ensure it ALWAYS returns something for testing
    }

    res.status(200).json({ success: true, data: finalRecommendations })
  } catch (error) {
    console.error("Recommendation System Crash:", error)
    res
      .status(500)
      .json({ success: false, message: "Engine Failure", error: error.message })
  }
}

module.exports = { aiCustomerSupport, getSmartRecommendations }

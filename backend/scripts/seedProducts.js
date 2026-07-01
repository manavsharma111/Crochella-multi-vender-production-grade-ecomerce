const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Product = require("../models/Product")
const connectDB = require("../config/db")
const path = require("path")

// Load environment variables from the root .env file
dotenv.config({ path: path.join(__dirname, "../.env") })

const seedProducts = async () => {
  try {
    await connectDB()

    // Clear existing products to avoid duplicates (Optional, but usually good for a clean seed)
    // await Product.deleteMany({});
    // console.log("Cleared existing products.");

    const categories = [
      "Wraps",
      "Coats",
      "Sarees",
      "Tunics",
      "Gowns",
      "Dresses",
      "Scarves",
      "Jackets",
    ]
    const materials = [
      "Pure Silk",
      "Cashmere",
      "Organic Cotton",
      "Silk Velvet",
      "Linen",
      "Pashmina",
      "Chiffon",
    ]
    const weaves = [
      "Handwoven",
      "Hand-stitched",
      "Jacquard Handloom",
      "Plain Weave",
      "Handcrafted",
      "Embroidered",
    ]
    const images = [
      "https://images.pexels.com/photos/852860/pexels-photo-852860.jpeg",
      "https://images.pexels.com/photos/1018911/pexels-photo-1018911.jpeg",
      "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg",
      "https://images.pexels.com/photos/4590215/pexels-photo-4590215.jpeg",
      "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg",
      "https://images.pexels.com/photos/291762/pexels-photo-291762.jpeg",
      "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg",
    ]

    const adjectives = [
      "Midnight",
      "Artisan",
      "Golden",
      "Heritage",
      "Crimson",
      "Royal",
      "Vintage",
      "Eternal",
      "Celestial",
      "Luminous",
      "Classic",
    ]

    const fakeProducts = []

    for (let i = 1; i <= 25; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const material = materials[Math.floor(Math.random() * materials.length)]
      const adjective =
        adjectives[Math.floor(Math.random() * adjectives.length)]
      const price = Math.floor(Math.random() * 40000) + 5000
      const hasDiscount = Math.random() > 0.6

      fakeProducts.push({
        productName: `${adjective} ${material} ${category}`,
        description: `Experience the luxury of this beautifully crafted ${category.toLowerCase()}. Made with authentic ${material.toLowerCase()} and designed with generations of heritage in mind.`,
        price: price,
        discountPrice: hasDiscount
          ? price - Math.floor(Math.random() * 2000) - 500
          : 0,
        stock: Math.floor(Math.random() * 30) + 1,
        media: [
          {
            url: images[Math.floor(Math.random() * images.length)],
            type: "image",
          },
        ],
        category: category,
        material: material,
        weaveType: weaves[Math.floor(Math.random() * weaves.length)],
        rating: (Math.random() * 1.5 + 3.5).toFixed(1), // rating between 3.5 and 5.0
        numReviews: Math.floor(Math.random() * 100),
      })
    }

    await Product.insertMany(fakeProducts)
    console.log(`${fakeProducts.length} Fake products seeded successfully!`)
    process.exit()
  } catch (error) {
    console.error("Error seeding products:", error)
    process.exit(1)
  }
}

seedProducts()

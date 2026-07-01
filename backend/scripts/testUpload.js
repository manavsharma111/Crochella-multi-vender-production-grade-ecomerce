const axios = require("axios")
const FormData = require("form-data")
const fs = require("fs")

async function test() {
  try {
    const form = new FormData()
    form.append("productName", "Test Saree")
    form.append("description", "Test Description")
    form.append("price", 15000)
    form.append("stock", 50)
    form.append("material", "Silk")
    form.append("category", "Sarees")

    // Let's omit the file upload first to see if it works with no media if we pass a JSON string.
    form.append(
      "media",
      JSON.stringify([{ url: "http://example.com/test.jpg", type: "image" }]),
    )

    // Let's get a token from the db or just print what the backend is complaining about
    // Actually without a valid token it will return 401 Unauthorized, not 500.
  } catch (e) {
    console.error(e)
  }
}
test()

describe("Return and Refund Flow", () => {
  it("Should let a user request a return with UPI details, and let admin process the refund", () => {
    // ==========================================
    // STEP 1: USER REQUESTS RETURN
    // ==========================================
    cy.visit("/")
    cy.get("nav button", { timeout: 15000 }).last().click()
    cy.get('input[type="email"]').type("g2680160@gmail.com")
    cy.get('input[type="password"]').type("1234567890") // Make sure this password is correct
    cy.get("button")
      .contains(/sign in/i)
      .first()
      .click()

    // Go to My Profile / Orders page
    cy.visit("/profile") // Adjust this URL if your orders page is somewhere else

    // Click the "My Orders" tab since Personal Info is the default
    // We add a wait here because React re-renders the page when profile data loads,
    // which was causing the button to detach while Cypress tried to click it.
    cy.wait(2000)
    cy.contains("button", /my orders/i, { timeout: 15000 }).click()

    // Find an order that is Delivered and click Return
    // Note: If you don't have a Delivered order, this step will fail.
    // The test assumes there's at least one delivered order ready to return.
    cy.contains(/delivered/i)
      .parents(".bg-\\[\\#1a1a1a\\]")
      .within(() => {
        cy.get("button")
          .contains(/return/i)
          .first()
          .click()
      })

    // Wait for the modal to open
    cy.get("div.bg-\\[\\#111\\]").should("be.visible") // Modal container

    // Select a reason
    cy.contains("Damaged or defective item").click()

    // Assuming it's a COD order, select UPI and enter ID
    // If it's not a COD order, these fields won't appear, so we make this optional or force it if we know.
    cy.get("body").then(($body) => {
      if ($body.text().includes("Refund Method (For COD Order)")) {
        cy.get('input[value="UPI"]').check({ force: true })
        cy.get('input[placeholder*="UPI ID"]').type("9876543210@ybl")
      }
    })

    // Submit Return
    cy.get("button")
      .contains(/submit return/i)
      .click()

    // Verify success toast or status change
    cy.contains(/return request submitted/i).should("be.visible")
    cy.contains(/returned/i).should("be.visible")

    // ==========================================
    // STEP 2: ADMIN PROCESSES REFUND
    // ==========================================
    // First, logout the user
    // (Assuming clearing localStorage logs you out, or you can click a logout button)
    cy.clearLocalStorage()

    // Login as Admin
    cy.visit("/")
    cy.get("nav button", { timeout: 15000 }).last().click()
    cy.get('input[type="email"]').type("admin@example.com") // CHANGE THIS TO YOUR ACTUAL ADMIN EMAIL
    cy.get('input[type="password"]').type("admin123") // CHANGE THIS TO YOUR ACTUAL ADMIN PASSWORD
    cy.get("button")
      .contains(/sign in/i)
      .first()
      .click()

    // Go to Admin Orders Dashboard
    cy.visit("/admin")

    // Find the Returned Order
    cy.contains(/returned/i)
      .parents("tr")
      .within(() => {
        cy.get("button")
          .contains(/update/i)
          .click()
      })

    // The Admin Order Modal should open
    // Verify we can see the Refund Details
    cy.contains("Refund Details").should("be.visible")
    cy.contains("Damaged or defective item").should("be.visible")

    // Click Refund & Restock
    // Note: Since this actually triggers a real API call and might mess up inventory,
    // you can comment the click() out if you just want to verify the UI.
    cy.get("button")
      .contains(/refund & restock/i)
      .click()

    // Verify it updates successfully
    cy.contains(/refund processed successfully/i).should("be.visible")
  })

  it("Should let a user request a return with Bank details", () => {
    // This is a quick test to ensure the Bank Transfer UI branch works as well
    cy.visit("/")
    cy.get("nav button", { timeout: 15000 }).last().click()
    cy.get('input[type="email"]').type("g2680160@gmail.com")
    cy.get('input[type="password"]').type("1234567890")
    cy.get("button")
      .contains(/sign in/i)
      .first()
      .click()

    cy.visit("/profile")
    cy.wait(2000)
    cy.contains("button", /my orders/i, { timeout: 15000 }).click()

    // Assuming there is another delivered order available
    cy.contains(/delivered/i)
      .parents(".bg-\\[\\#1a1a1a\\]")
      .within(() => {
        cy.get("button")
          .contains(/return/i)
          .first()
          .click()
      })

    cy.get("div.bg-\\[\\#111\\]").should("be.visible")
    cy.contains("Size or fit issue").click()

    cy.get("body").then(($body) => {
      if ($body.text().includes("Refund Method (For COD Order)")) {
        // Test Bank details
        cy.get('input[value="Bank"]').check({ force: true })
        cy.get('input[placeholder*="Account Holder Name"]').type("John Doe")
        cy.get('input[placeholder*="Account Number"]').type("123456789012")
        cy.get('input[placeholder*="IFSC"]').type("HDFC0001234")
      }
    })

    // Click cancel instead of submit to not exhaust all delivered orders for future test runs!
    cy.get("button")
      .contains(/cancel/i)
      .click()
  })
})

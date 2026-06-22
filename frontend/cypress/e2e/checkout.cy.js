describe('Checkout Flow', () => {
  it('Should successfully login, add item to cart, and checkout via COD', () => {
    // 1. Visit Home Page and open Auth modal
    cy.visit('/')
    // Click the Account tab in the navbar (it's the last button in the nav)
    // We wait up to 10 seconds because the initial animated preloader hides the navbar
    cy.get('nav button', { timeout: 15000 }).last().click()
    
    // 2. Login
    cy.get('input[type="email"]').type('g2680160@gmail.com')
    // Assuming password is "123456". You may need to change this in the script if it's different!
    cy.get('input[type="password"]').type('1234567890')
    cy.get('button').contains(/sign in/i).click()

    // 3. Wait for Auth modal to change to profile or close
    cy.contains(/welcome|profile|my orders/i).should('exist')

    // 4. Go to Shop and Add to Cart
    cy.visit('/shop')
    cy.get('button').contains(/add to cart/i).first().click()

    // 5. Go to Cart
    cy.visit('/cart')
    cy.get('button').contains(/checkout/i).click()

    // 6. Fill Checkout details (assuming there are address fields, using generic selectors)
    // Update these selectors if your checkout form uses specific IDs or names
    cy.get('input[placeholder*="Address"]').clear().type('123 Test Street')
    cy.get('input[placeholder*="City"]').clear().type('Test City')
    cy.get('input[placeholder*="Pin"]').clear().type('110001')

    // Select Cash on Delivery
    cy.get('input[value="COD"]').click({ force: true }) // Adjust value or selector based on actual UI

    // 7. Place Order
    cy.get('button').contains(/place order|confirm/i).click()

    // 8. Verify Success Page
    cy.url().should('include', '/order-success')
    cy.contains(/order successful|success/i).should('be.visible')
  })
})

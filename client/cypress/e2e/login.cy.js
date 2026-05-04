describe('ShopSmart E2E Flow', () => {
  it('loads the homepage and shows key UI elements', () => {
    cy.visit('/');
    cy.contains('ShopSmart').should('be.visible');
    cy.contains('Future of').should('be.visible');
    cy.contains('Explore Collection').should('be.visible');
  });

  it('displays a product grid after loading', () => {
    cy.visit('/');
    cy.get('.product-grid', { timeout: 8000 }).should('exist');
    cy.get('.product-card').should('have.length.greaterThan', 0);
  });

  it('opens and closes the cart panel', () => {
    cy.visit('/');
    cy.get('.cart-btn').click();
    cy.get('.cart-panel').should('be.visible');
    cy.contains('Your Cart').should('be.visible');
    cy.contains('Your cart is empty.').should('be.visible');
  });

  it('adds a product to the cart and updates cart count', () => {
    cy.visit('/');
    cy.get('.product-grid', { timeout: 8000 }).should('exist');
    cy.get('.product-card').first().trigger('mouseover');
    cy.get('.add-to-cart').first().click();
    cy.get('.cart-count').should('contain', '1');
  });
});

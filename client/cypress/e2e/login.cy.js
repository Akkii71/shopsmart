describe('End-to-End User Flow', () => {
  it('Simulates real user flow: Login -> Action -> Result', () => {
    // 1. Visit the login page
    cy.visit('/login');

    // 2. Perform Login action
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // 3. Verify Result (e.g. redirected to dashboard and elements exist)
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back, Test User').should('be.visible');

    // 4. Perform secondary action
    cy.get('[data-cy="add-item-btn"]').click();
    cy.get('.toast-message').should('contain', 'Item added successfully');
  });
});

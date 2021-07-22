describe('The Login Page', () => {
  it('Successfully loads', () => {
    cy.visit('/');
    cy.url().should('include', '/login')
  })

  it('Allow to login and logout', () => {
    cy.visit('/login');
    cy.login();
    cy.url().should('not.include', '/login');
    cy.contains("Logout").click();
  })
})

describe('The Login Page', () => {
    it('successfully loads', () => {
      cy.visit('/');
      cy.url().should('include', '/login')
    })
    
    it('allow to login', () => {
        cy.visit('/login');
        cy.get('input[name=login]').type("user1")
        cy.get('input[name=password]').type(`123456{enter}`)
        cy.url().should('not.include', '/login')
        cy.contains('Logout').click()
        cy.url().should('include', '/login')
    })
})
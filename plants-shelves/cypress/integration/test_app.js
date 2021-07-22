Cypress.Commands.add('login', () => {
    cy.get('input[name=login]').type("user1")
    cy.get('input[name=password]').type(`123456{enter}`)
    cy.url().should('not.include', '/login')
})
  
Cypress.Commands.add('logout', () => {
    cy.logout()
    cy.url().should('include', '/login')
})
  
Cypress.Commands.add('getSessionStorage', (key) => {
    cy.window().then((window) => window.sessionStorage.getItem(key))
})
  
Cypress.Commands.add('setSessionStorage', (key, value) => {
    cy.window().then((window) => {
      window.sessionStorage.setItem(key, value)
    })
})
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('login', () => {
  cy.visit('/login');
  cy.get('input[name=login]').type("user1")
  cy.get('input[name=password]').type(`123456{enter}`)
})

Cypress.Commands.add('logout', () => {
  cy.visit('/logout');
})

Cypress.Commands.add('create', (name, scientificName) => {
    cy.get('[data-test=create-btn]').click()
    cy.get('[data-test=name-input]').type(name)
    cy.get('[data-test=sc-name-input]').type("scientificName{enter}")
})

Cypress.Commands.add('delete', (index=0) => {
  cy.get(`[data-test=plant-controls-${index}] > [data-test=remove-btn]`).click()
  cy.get('[data-test=modal-button-delete]').click()
})

Cypress.Commands.add('water', (index=0) => {
  cy.get(`[data-test=plant-controls-${index}] > [data-test=water-btn]`).click()
})

Cypress.Commands.add('editName', (index=0, name) => {
  cy.get(`[data-test=plant-controls-${index}] > [data-test=edit-btn]`).click()
  cy.get('[data-test=plant-name-input]').type(`${name}{enter}`)
})

Cypress.Commands.add('getLocalStorageValue', (key) => {
  cy.window().then((window) => window.localStorage.getItem(key))
})

Cypress.Commands.add('setLocalStorage', (key, value) => {
  cy.window().then((window) => {
    window.localStorage.setItem(key, value)
  })
})

Cypress.Commands.add('cleanLocalStorageKey', (key) => {
  cy.window().then((window) => {
    window.localStorage.removeItem(key)
  })
})

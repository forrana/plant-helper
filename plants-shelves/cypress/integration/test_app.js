describe('Main features', () => {
    beforeEach(() => {
        cy.login()
    })

    afterEach(() => {
        cy.logout()
    })

    const name = "Aloe 1"
    const scName = "Aloe Vera"

    it('Allow to create plant', () => {
        cy.get("[data-test=message-no-plants]").should("exist")
        cy.create(name, scName)
        cy.contains(name)
        cy.delete()
        cy.get("[data-test=message-no-plants]").should("exist")
    })
})

describe('When token expired features', () => {
    const name = "Aloe 1"
    const scName = "Aloe Vera"

    beforeEach(() => {
        cy.contains("Login")
        cy.login()
        cy.wait(300);
    })

    afterEach(() => {
        cy.logout()
        cy.contains("Login")
    })

    it('Logout on page reload', () => {
        cy.clearLocalStorage();
        cy.wait(300);
        cy.reload();
        cy.url().should('include', '/login');
    })

    it('Logout on create', () => {
        cy.clearLocalStorage();
        cy.wait(100);
        cy.create(name, scName)
        cy.url().should('include', '/login')
    })

    it('Logout on edit', () => {
        const randomName = `plant-${Cypress._.random(0, 1e6)}`
        cy.create(name, scName)
        cy.clearLocalStorage()
        cy.wait(100)
        cy.editName(0 ,randomName)
        cy.url().should('include', '/login')
        cy.login()
        cy.delete()
    })

    it('Logout on delete', () => {
        const randomName = `plant-${Cypress._.random(0, 1e6)}`
        cy.create(name, scName)
        cy.clearLocalStorage()
        cy.wait(100)
        cy.delete()
        cy.url().should('include', '/login')
        cy.login()
        cy.delete()
    })
})
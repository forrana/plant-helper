describe('Main features', () => {
    beforeEach(() => {
        cy.login()
    })

    afterEach(() => {
        cy.logout()
    })

    it('Allow to create plant', () => {
        const name = "Aloe 1"
        const scName = "Aloe Vera"

        cy.get("[data-test=message-no-plants]").should("exist")
        cy.create(name, scName)
        cy.contains(name)
        cy.delete()
        cy.get("[data-test=message-no-plants]").should("exist")
    })
})

describe('When token expired features', () => {
    beforeEach(() => {
        cy.login()
        cy.wait(300);
    })
    it('Logout on page reload', async () => {
        cy.clearLocalStorage();
        cy.wait(300);
        cy.reload();
        cy.url().should('include', '/login');
    })
    it('Logout on create', async () => {
        const name = "Aloe 1"
        const scName = "Aloe Vera"
        cy.clearLocalStorage();
        cy.wait(100);
        cy.create(name, scName)
        cy.url().should('include', '/login')
    })
})
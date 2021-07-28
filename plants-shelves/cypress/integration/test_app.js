describe('Main features', () => {
    beforeEach(() => {
        cy.login()
    })

    afterEach(() => {
        cy.logout()
    })

    const name = `plant-${Cypress._.random(0, 1e6)}`
    const scName = "Aloe Vera"
    describe('Create', () => {
        it('Allow to create plant by pressing plus button', () => {
            cy.get("[data-testid=message-no-plants]").should("exist")
            cy.create(name, scName)
            cy.contains(name)
            cy.delete()
            cy.get("[data-testid=message-no-plants]").should("exist")
        })

        it('Allow to create plant by pressing create button', () => {
            cy.get("[data-testid=message-no-plants]").should("exist")
            cy.get("[data-testid=empty-view-create-button]").click()
            cy.get('[data-testid=name-input]').type(name)
            cy.get('[data-testid=sc-name-input]').type("scientificName{enter}")
            cy.contains(name)
            cy.delete()
            cy.get("[data-testid=message-no-plants]").should("exist")
        })
    })
})
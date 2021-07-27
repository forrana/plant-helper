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
            cy.get("[data-test=message-no-plants]").should("exist")
            cy.create(name, scName)
            cy.contains(name)
            cy.delete()
            cy.get("[data-test=message-no-plants]").should("exist")
        })

        it('Allow to create plant by pressing create button', () => {
            cy.get("[data-test=message-no-plants]").should("exist")
            cy.get("[data-test=empty-view-create-button]").click()
            cy.get('[data-test=name-input]').type(name)
            cy.get('[data-test=sc-name-input]').type("scientificName{enter}")
            cy.contains(name)
            cy.delete()
            cy.get("[data-test=message-no-plants]").should("exist")
        })
    })
})
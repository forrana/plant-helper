describe('Plant features', () => {
    const name = "Aloe 1"
    const scName = "Aloe Vera"

    beforeEach(() => {
        cy.login()
        cy.create(name, scName)
        cy.contains(name)
    })

    afterEach(() => {
        cy.delete()
        cy.logout()
    })

    it('Allow to edit a plant', () => {
        const randomName = `plant-${Cypress._.random(0, 1e6)}`
        cy.editName(0, randomName)
        cy.contains(randomName)
    })
})
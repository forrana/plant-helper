describe('The App', () => {
    beforeEach(() => {
        cy.login()
    })

    afterEach(() => {
        cy.logout()
    })

    it('Allow to create plant', () => {
        const name = "Aloe 1"
        const scName = "Aloe Vera"
        cy.create(name, scName)
        cy.contains(name)
        cy.delete()
    })
})
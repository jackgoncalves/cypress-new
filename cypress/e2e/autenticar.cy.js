/// <reference types="cypress"/>

import { fa, faker } from '@faker-js/faker'

describe('crud', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/notes').as('getNotes')
        cy.sessaoLogin()
    })
    it('cruds a note', () => {

        const notas = faker.lorem.words(4)

        cy.criarNotas(notas)
        cy.wait('@getNotes')

        const attNotas = faker.lorem.words(5)
        const attachFile = true

        cy.attNotas(notas, attNotas, attachFile)
        cy.wait('@getNotes')

        cy.deletarNotas(attNotas)

    })

    it('Formulario com sucesso', () => {

        cy.intercept('POST', '**/prod/billing').as('pagamento')

        cy.preencheFormulario()

        cy.wait('@getNotes')
        cy.wait('@pagamento')
            .its('be.equal', 'Complete')
    })

    it.only('logout', () => {
        cy.visit('/')
        cy.wait('@getNotes')

        if (Cypress.config('viewportWidth') < Cypress.env('viewportWidthBreakpoint')) {
            cy.get('.navbar-toggle.collapsed')
                .should('be.visible')
                .click()
        }

        cy.contains('.nav a', 'Logout').click()

        cy.get('#email').should('be.visible')
    })
})
Cypress.Commands.add('cadastroUsuario', (emailAddress, password) => {

    cy.intercept('GET', '**/notes').as('getNotes')
    cy.visit('/signup')
    cy.get('#email').type(emailAddress)
    cy.get('#password').type(password, { log: false })
    cy.get('#confirmPassword').type(password, { log: false })
    cy.contains('button', 'Signup').click()
    cy.get('#confirmationCode').should('be.visible')

    cy.mailosaurGetMessage(Cypress.env('MAILOSAUR_SERVER_ID'), {
        sentTo: emailAddress
    }).then(message => {
        const confirmationCode = message.html.body.match(/\d{6}/)[0]
        cy.get('#confirmationCode').type(`${confirmationCode}{enter}`)
        cy.wait('@getNotes')
    })
})


Cypress.Commands.add('loginSucesso', (
    user = Cypress.env('USER_EMAIL'),
    password = Cypress.env('USER_PASSWORD')
) => {

    cy.intercept('GET', '**/notes').as('getNotes')
    cy.visit('/login')
    cy.get('#email').type(user)
    cy.get('#password').type(password, { log: false })
    cy.contains('button', 'Login').click()
    cy.wait('@getNotes')
    cy.contains('h1', 'Your Notes').should('be.visible')

})

Cypress.Commands.add('sessaoLogin', (
    user = Cypress.env('USER_EMAIL'),
    password = Cypress.env('USER_PASSWORD')
) => {

    const login = () => cy.loginSucesso(user, password)
    cy.session(user, login)

})




const attachFileHandler = () => {
    cy.get('#file').selectFile('cypress/fixtures/example.json')
}



Cypress.Commands.add('criarNotas', (notas, attachFile = false) => {

    cy.visit('/notes/new')
    cy.get('#content').type(notas)

    if (attachFile) {
        attachFileHandler()
    }

    cy.contains('button', 'Create').click()
    cy.contains('.list-group', notas).should('be.visible')

})


Cypress.Commands.add('attNotas', (notas, attNotas, attachFile = false) => {

    cy.intercept('GET', '**/notes/**').as('getNote')

    cy.contains('.list-group-item', notas).click()
    cy.wait('@getNote')

    cy.get('#content').clear()
    cy.get('#content').type(attNotas)

    if (attachFile) {
        attachFileHandler()
    }

    cy.contains('button', 'Save').click()

    cy.contains('.list-group-item', attNotas).should('be.visible')
    cy.contains('.list-group-item', notas).should('not.exist')

})

Cypress.Commands.add('deletarNotas', (attNotas) => {

    cy.contains('.list-group-item', attNotas).click()
    cy.contains('button', 'Delete').click()

    cy.get('.list-group-item')
        .its('length')
        .should('be.at.least', 1)

    cy.contains('.list-group-item', attNotas).should('not.exist')

})



Cypress.Commands.add('preencheFormulario', () => {

    cy.visit('/settings')
    cy.get('#storage').type('1')
    cy.get('#name').type('Mary Doe')
    cy.iframe('.card-field iframe')
        .as('iframe')
        .find('[name="cardnumber"]')
        .type('4242424242424242')
    cy.get('@iframe')
        .find('[name="exp-date"]')
        .type('1271')
    cy.get('@iframe')
        .find('[name="cvc"]')
        .type('123')
    cy.get('@iframe')
        .find('[name="postal"]')
        .type('12345')
    cy.contains('button', 'Purchase').click()

})

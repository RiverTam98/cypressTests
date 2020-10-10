describe('User can log into CIMS, edit, publish and log out, log into back office and confirm published JSON', () => {
  it('Verifys cims is hosted, user can log in, edit one page, publish and log out, log into back office, confirm publication', () => {

    //navigate to the cims staging website first to make the edit 
    cy.visit("https://cims.staging.criton.com/")

    //log in 
    cy.get("#email").type("gail.phillips@criton.com")
    cy.get("#password").type("t&Fs9U$LW&kf")
    cy.get(".MuiButton-label").click()

    //go to Automated Test app to edit, save and publish
    cy.get('.MuiTypography-h4').should('have.text', 'Select Your App')
    cy.get('[data-cy-id="32"] > .MuiGrid-spacing-xs-2 > :nth-child(1) > [data-cy=card-action] > .MuiPaper-root > .jss381 > [data-cy=app-name]').scrollIntoView()
    cy.get('[data-cy-id="32"] > .MuiGrid-spacing-xs-2 > :nth-child(1) > [data-cy=card-action] > .MuiPaper-root > .jss381 > [data-cy=app-name]').click()
    cy.get(':nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > div > .MuiTypography-h5').click()
    cy.get('#text').click()
    cy.focused().clear()

    const uniqueNum = () => Cypress._.random(0, 1e8)
    const id = uniqueNum()
    const testname = `cimsTest${id}`
    cy.get('#text').type(testname)
    cy.get(':nth-child(1) > .MuiButton-label').click()
    cy.get('#tab-1 > .MuiTab-wrapper').click()
    cy.get('.jss829 > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root > .MuiButton-label').click()
    cy.get('.MuiButton-textPrimary > .MuiButton-label').click()
    cy.get('[style="padding-top: 16px; margin-bottom: 0.75rem; font-weight: bold;"]').should('have.text', 'Your changes have been successfully published.')
    cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(6)').should((emailMine) => {
      const text = emailMine.text()
      expect(text).to.contain('gail.phillips@criton.com')
    })

    //log out of CIMS 
    cy.get('.MuiButton-label > .MuiSvgIcon-root > path').click()
    cy.get('#header-menu > .MuiPaper-root > .MuiList-root > [tabindex="-1"]').click()

    //navigate to the staging BackOffice to confirm edit was published 
    cy.visit("https://backoffice-staging.criton.com/apps/")
    //log in 
    cy.get("#id_username").type("gail.phillips@criton.com")
    cy.get("#id_password").type("vwme5lVd")
    cy.get(".btn").click()

    //go to Automated Test App in BackOffice
    cy.get('[href="/apps/32/hotels/57/"] > .edit-hotel-button > .d-flex > .w-100').scrollIntoView()
    cy.get('[href="/apps/32/hotels/57/"] > .edit-hotel-button > .d-flex > .w-100').click()
    cy.get(':nth-child(6) > a').click()
    cy.log(':nth-child(2) > .mb-3')

    cy.get('#id_content').should((publishText) => {
      const text = publishText.text()
      expect(text).to.contain(testname)
    })
    cy.get(':nth-child(8) > a').click()

    cy.get('tbody > :nth-child(1) > :nth-child(3)').should((emailMine) => {
      const text = emailMine.text()
      expect(text).to.contain('gail.phillips@criton.com')
    })
    cy.get('tbody > :nth-child(1) > :nth-child(2)').within(($list) => { }).should((dateCheck) => {
      const todaysDate = Cypress.moment().format('YYYY-MM-DD')
      const text = dateCheck.text()
      expect(text).include(todaysDate)
    })
  })
})

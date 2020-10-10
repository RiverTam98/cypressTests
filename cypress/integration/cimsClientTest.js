describe('Client can log into CIMS, edit, publish and log out, with a admin log into back office and confirm published JSON', () => {
  it('Verifys cims is hosted, user can log in, edit one page, publish and log out, log into back office, confirm publication', () => {

    //navigate to the cims staging website first to make the edit 
    cy.visit("https://cims.staging.criton.com/")

    //log in 
    cy.get("#email").type("cheval@criton.com")
    cy.get("#password").type("Password")
    cy.get(".MuiButton-label").click()

    //go to Automated Test app to edit, save and publish
    cy.get('.MuiTypography-h4').should('have.text', 'Content Pages')
    cy.get(':nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > div > .MuiTypography-h5').click()
    cy.get('#text').click()
    cy.focused().clear()

    const uniqueNum = () => Cypress._.random(0, 1e8)
    const id = uniqueNum()
    const testname = `cimsTest${id}`
    cy.get('#text').type(testname)
    cy.get(':nth-child(1) > .MuiButton-label').click()
    cy.get('#tab-1 > .MuiTab-wrapper').click()
    cy.get('.MuiGrid-root > .MuiButtonBase-root > .MuiButton-label').click()
    cy.get('.MuiButton-textPrimary > .MuiButton-label').click()
    cy.get('.MuiTypography-h6').should('have.text', 'Your changes have been successfully published.')
    cy.get('[style="height: 100%;"]').within(($list) => { }).should((dateCheck) => {
      const todaysDate = Cypress.moment().format('DD/MM/YYYY')
      const text = dateCheck.text()
      expect(text).not.include(todaysDate)
    })

    //log out of CIMS 
    cy.get('.MuiButton-label > .MuiSvgIcon-root > path').click()
    cy.get('#header-menu > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root').click()

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
      expect(text).to.contain('cheval@criton.com')
    })
    cy.get('tbody > :nth-child(1) > :nth-child(2)').within(($list) => { }).should((dateCheck) => {
      const todaysDate = Cypress.moment().format('YYYY-MM-DD')
      const text = dateCheck.text()
      expect(text).include(todaysDate)
    })
  })
})
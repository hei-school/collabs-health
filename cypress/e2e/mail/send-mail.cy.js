Cypress.Commands.add("login", (username, password) => {
  cy.visit(Cypress.env("mailUrl"));
  cy.get("#rcmloginuser").type(username);
  cy.get("#rcmloginpwd").type(password, { log: false });
  cy.get("#rcmloginsubmit").click();
  cy.url().should("include", "?_task");
});

Cypress.Commands.add("extractSubjectsFromRows", (numRows = 10) => {
  return cy.get('tr[id^="rcmrow"]').then(($rows) => {
    const extractedSubjects = [];
    $rows.slice(0, numRows).each((index, row) => {
      cy.wrap(row)
        .find("td.subject > .subject > a > span")
        .invoke("text")
        .then((text) => {
          extractedSubjects.push(text.trim());
        });
    });
    return cy.wrap(extractedSubjects);
  });
});

Cypress.Commands.add(
  "checkSubjectInMessages",
  (subject, numRows = 10, shouldExist = true) => {
    cy.extractSubjectsFromRows(numRows).then((subjects) => {
      const subjectFound = subjects.some((text) => text === subject);
      expect(subjectFound).to.equal(shouldExist);
    });
  },
);

Cypress.Commands.add("navigateToCompose", () => {
  const composeUrl = `${Cypress.env("mailUrl")}/?_task=mail&_action=compose`;
  cy.visit(composeUrl);
  
  // Handle potential redirects
  cy.url().should('include', '_task=mail&_action=compose');
  
  // Wait for the page to stabilize
  cy.get('body').should('not.have.class', 'loading');
  
  // Check for error box and retry if present
  cy.get('body').then($body => {
    if ($body.find('.boxerror').length > 0) {
      cy.wait(5000); // Wait for 5 seconds
      cy.visit(composeUrl);
      cy.url().should('include', '_task=mail&_action=compose');
      cy.get('body').should('not.have.class', 'loading');
    }
  });
  
  // Ensure the compose form is visible
  cy.get('#compose-content').should('be.visible');
});

describe("Send health mail", () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
    console.log('Uncaught exception:', err.message)
    return false
  })

  it("should send health mail", () => {
    const currentTime = new Date().toLocaleString();
    const subject = `Health check - ${currentTime}`;

    cy.login(Cypress.env("mailUsername"), Cypress.env("mailPassword"));

    cy.navigateToCompose();

    cy.get('#compose_to', { timeout: 20000 }).should('be.visible').type(Cypress.env("receiverMail"));
    cy.get("#compose-subject").should('be.visible').type(subject);
    cy.get("#composebody").should('be.visible').type(subject);
    cy.get("#rcmbtn112").click();

    cy.visit(`${Cypress.env("mailUrl")}/?_task=mail&_mbox=Sent`);
    cy.get('tr[id^="rcmrow"]').should("be.visible");
    cy.checkSubjectInMessages(subject, 5, true);
  });
});

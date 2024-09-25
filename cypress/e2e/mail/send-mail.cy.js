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

describe("Send health mail", () => {
  it("should send health mail", () => {
    const currentTime = new Date().toLocaleString();
    const subject = `Health check - ${currentTime}`;

    cy.login(Cypress.env("mailUsername"), Cypress.env("mailPassword"));

    cy.visit(`${Cypress.env("mailUrl")}/?_task=mail&_action=compose`);
    cy.get('#compose_to > .col-10 > .input-group > .form-control').type(Cypress.env("receiverMail"));
    cy.get("#compose-subject").type(subject);
    cy.get("#composebody").type(subject);
    cy.get("#rcmbtn112").click();

    cy.visit(`${Cypress.env("mailUrl")}/?_task=mail&_mbox=Sent`);
    cy.get('tr[id^="rcmrow"]').should("be.visible");
    cy.checkSubjectInMessages(subject, 5, true);
  });
});

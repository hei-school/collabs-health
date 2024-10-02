Cypress.Commands.add("login", (username, password) => {
  cy.visit(Cypress.env("mailUrl"));
  cy.get("#rcmloginuser").type(username);
  cy.get("#rcmloginpwd").type(password, { log: false });
  cy.get("#rcmloginsubmit").click();
  cy.url().should("include", "?_task");
});

Cypress.Commands.add("extractSubjectsFromRows", (numRows = 10) => {
  return cy.get("#messagelist-content").then(($messageList) => {
    cy.wait(3000);

    //TODO: It works only when user have minimum one mail on inbox
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

describe("Check error mail", () => {
  const errorSubject = "Undelivered Mail Returned to Sender";

  it("should not have error mail", () => {
    cy.login(Cypress.env("mailUsername"), Cypress.env("mailPassword"));
    cy.checkSubjectInMessages(errorSubject, 10, false);
  });
});

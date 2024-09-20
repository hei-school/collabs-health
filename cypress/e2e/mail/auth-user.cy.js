describe("Mail Authentification", () => {
  it("should lands on compose page if succeeds", () => {
    cy.visit(Cypress.env("mailUrl"));

    cy.get("#rcmloginuser").type(Cypress.env("mailUsername"));
    cy.get("#rcmloginpwd").type(Cypress.env("mailPassword"));

    cy.get("#rcmloginsubmit").click();

    cy.url().should("include", "?_task");
  });
});

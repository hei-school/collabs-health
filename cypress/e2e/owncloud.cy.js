describe("Owncloud Authentification", () => {
  it("should lands on directory page if login succeeds", () => {
    cy.visit(Cypress.env("owncloudUrl") + "/login");

    cy.get("#user").type(Cypress.env("owncloudUsername"));
    cy.get("#password").type(Cypress.env("owncloudPassword") + '{enter}');

    cy.wait(1500);
    cy.url().should('include', Cypress.env("owncloudUrl") + "/apps/files");
  });
});


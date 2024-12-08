describe("Status Authentification", { retries: 2 }, () => {
  it("should lands on profile page if succeeds", () => {
    cy.visit(Cypress.env("HEIAdminUrl"));
    cy.wait(1500);
    cy.get("#username").type(Cypress.env("HEIAdminUsername"));
    cy.get("#password").type(Cypress.env("HEIAdminPassword"));

    cy.get(".MuiButtonBase-root").click();

    cy.wait(6000)
    cy.url().should("include", "/profile");
  });
});

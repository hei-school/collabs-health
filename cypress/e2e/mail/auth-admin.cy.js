describe("Mail Admin Authentification", () => {
  it("should lands on admin overview page", () => {
    cy.visit(Cypress.env("mailUrl") + "/admin/login.php");

    cy.get("#fUsername").type(Cypress.env("mailAdminUsername"));
    cy.get("#fPassword").type(Cypress.env("mailAdminPassword") + "{enter}");

    cy.url().should("include", "/admin/main.php");
  });
});

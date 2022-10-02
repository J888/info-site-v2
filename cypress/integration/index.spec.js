/* eslint-disable */

describe("Home/front page [index]", () => {
  before(() => {
    cy.visit("/");
  });
  beforeEach(() => {
    cy.readFile("tmp/cypressData/siteConfig.json").as("siteConf");
  });

  it("Has all categories on the home page", () => {
    cy.get("@siteConf").then((siteConf) => {
      for (let category in siteConf.categories) {
        cy.contains(category.key);
        cy.contains(
          `More in ${category.label}`
        );
        cy.contains(category.description);
      }
    });
  });
  it("Has the site purpose", () => {
    cy.get("@siteConf").then((siteConf) => {
      cy.contains(siteConf.site.statements.purpose.short);
    });
  });
  it("Has featured section title", () => {
    cy.get("@siteConf").then((siteConf) => {
      cy.contains(siteConf.featuredSection.titleText);
    });
  });
});

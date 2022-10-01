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
      for (let key in siteConf.categoryDescriptions) {
        cy.contains(key);
        cy.contains(
          `More in ${key.substring(0, 1).toUpperCase() + key.substring(1)}`
        );
        cy.contains(siteConf.categoryDescriptions[key]);
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

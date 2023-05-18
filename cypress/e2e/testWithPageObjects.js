import {
  navigateTo,
  onNavigationPage,
} from "../support/page_objects/navigationPage";

describe("Test with page objects", () => {
  beforeEach("open application", () => {
    cy.visit("/");
  });

  it("verify navigation across the pages", () => {
    navigateTo.formLayoutsPage();
    navigateTo.datePickerPage();
    navigateTo.smartTablePage();
    navigateTo.tooltipPage();
    navigateTo.toasterPage();
  });
});

import { navigateTo } from "../support/page_objects/navigationPage";
import { onFormLayoutsPage } from "../support/page_objects/formLayoutsPage";
import { onDatePickerPage } from "../support/page_objects/datePickerPage";
import { onSmartTablePage } from "../support/page_objects/smartTablePage";

describe("Test with page objects", () => {
  beforeEach("open application", () => {
    cy.openHomePage();
  });

  it("verify navigation across the pages", () => {
    navigateTo.formLayoutsPage();
    navigateTo.datePickerPage();
    navigateTo.smartTablePage();
    navigateTo.tooltipPage();
    navigateTo.toasterPage();
  });

  it("should submit inline and basic form and select tomorrows date in the calendar", () => {
    navigateTo.formLayoutsPage();
    onFormLayoutsPage.submitInlineFormWithNameAndEmail(
      "Jane Doe",
      "test@test.com"
    );

    onFormLayoutsPage.submitBasicFormWithEmailAndPassword(
      "test@test.com",
      "password"
    );
    navigateTo.datePickerPage();
    onDatePickerPage.selectCommonDatePickerFromToday(1);
    onDatePickerPage.selectDatePickerWithRangeFromToday(7, 14);
    navigateTo.smartTablePage();
    onSmartTablePage.addNewRecordWithFirstAndLastName("John", "Smith");
    onSmartTablePage.updateAgeByFirstName("John", "23");
    onSmartTablePage.deleteRowByIndex("1");
  });
});

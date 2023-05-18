function selectGroupMenuItem(groupName) {
  cy.contains("a", groupName).then((menu) => {
    cy.wrap(menu)
      .find(".expand-state g g")
      .invoke("attr", "data-name")
      .then((att) => {
        if (att.includes("left")) {
          cy.wrap(menu).click();
        }
      });
  });
}

export class NavigationPage {
  formLayoutsPage() {
    selectGroupMenuItem("Form");
    cy.contains("Form Layouts").click();
  }

  datePickerPage() {
    selectGroupMenuItem("Form");
    cy.contains("Datepicker").click();
  }

  toasterPage() {
    cy.contains("Modal & Overlays").click();
    cy.contains("Toastr").click();
  }

  smartTablePage() {
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();
  }

  tooltipPage() {
    cy.contains("Modal & Overlays").click();
    cy.contains("Tooltip").click();
  }
}

export const navigateTo = new NavigationPage();

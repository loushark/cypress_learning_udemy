function selectDayFromCurrent(day) {
  // mocking the date so tests can pass no matter when they are run
  let date = new Date();
  date.setDate(date.getDate() + day);

  let futureDay = date.getDate();
  let futureMonth = date.toLocaleString("default", { month: "short" });
  let dateAssert = futureMonth + " " + futureDay + ", " + date.getFullYear();

  cy.get("nb-calendar-navigation")
    .invoke("attr", "ng-reflect-date")
    .then((dateAttribute) => {
      if (!dateAttribute.includes(futureMonth)) {
        cy.get('[data-name="chevron-right"]').click();
        selectDayFromCurrent(day);
      } else {
        cy.get(".day-cell").not(".bounding-month").contains(futureDay).click();
      }
    });
  return dateAssert;
}

export class DatePickerPage {
  selectCommonDatePickerFromToday(dayFromToday) {
    cy.contains("nb-card", "Common Datepicker")
      .find("input")
      .then((input) => {
        // input is a JQuery object so needs to be wrapped to convert it to a cypress object
        // in order to be able to use the cypress click function
        cy.wrap(input).click();
        let dateAssert = selectDayFromCurrent(dayFromToday);

        // cy.get("nb-calendar-day-picker").contains("17").click();
        // cy.wrap(input)
        //   .invoke("prop", "value")
        //   // .should("contain", "Apr 17, 2023");
        //   .then((value) => {
        //     expect(value).to.equal(date);
        //   });

        cy.wrap(input).invoke("prop", "value").should("contain", dateAssert);
      });
  }

  selectDatePickerWithRangeFromToday(firstDay, secondDay) {
    cy.contains("nb-card", "Datepicker With Range")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();
        let dateAssertFirst = selectDayFromCurrent(firstDay);
        let dateAssertsecond = selectDayFromCurrent(secondDay);

        const finalDate = dateAssertFirst + " - " + dateAssertsecond;
        cy.wrap(input).invoke("prop", "value").should("contain", finalDate);
      });
  }
}

export const onDatePickerPage = new DatePickerPage();

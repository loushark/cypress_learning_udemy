/// <reference types="cypress" />

describe("our first suite", () => {
  it("first test: finding web elements", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    //get element by Tag name
    cy.get("input");

    // get by ID
    cy.get("#inputEmail1");

    // get by Class name
    cy.get(".input-full-width");

    // by attribute name
    cy.get("[placeholder]");

    // by attribute name and value
    cy.get('[placeholder="Email"]');

    // by class value
    cy.get('[class="input-full-width size-medium shape-rectangle"]');

    //  by tag name and attribute with value
    cy.get('input[placeholder="Email"]');

    // by two different attributes
    cy.get('[placeholder="Email"][fullWidth]');

    //tag name, attribute with value, id and class name
    cy.get('input[placeholder="Email"]#inputEmail1.input-full-width');

    // most recommended way by cypress, add your own locator
    cy.get('[data-cy="imputEmail1"]');
  });

  it("first test: finding web elements", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    cy.get('[data-cy="signInButton"');

    cy.contains("Sign in");
    // if theres more than one "sign in" on the page, use more than one attribute:
    cy.contains('[status="warning"]', "Sign in");

    // travelling through the DOM:
    // finding nested elements, get element where the parent is a form, and find the button.
    // cannot use get in replacement of find as get searches the whole page not just the specific nested element
    cy.get("#inputEmail3")
      .parents("form")
      .find("button")
      .should("contain", "Sign in")
      .parents("form")
      .find("nb-checkbox")
      .click();

    // finding sibling elements
    cy.contains("nb-card", "Horizontal form").find('[type="email"]');

    // notes:
    // cy.get is searching elements in the entire DOM
    // cy.find is used to find the child elements from the parent elements,
    // and accepts the same types of selectors as .get
  });

  it("then and wrap methods", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    // example:
    cy.contains("nb-card", "Using the Grid")
      .find('[for="inputEmail1"]')
      .should("contain", "Email");

    cy.contains("nb-card", "Using the Grid")
      .find('[for="inputPassword2"]')
      .should("contain", "Password");

    cy.contains("nb-card", "Basic form")
      .find('[for="exampleInputEmail1"]')
      .should("contain", "Email address");

    cy.contains("nb-card", "Basic form")
      .find('[for="exampleInputPassword1"]')
      .should("contain", "Password");

    // turn the above into a then and wrap methods:
    // find the locator of the nb card
    cy.contains("nb-card", "Using the Grid").then((firstForm) => {
      // saved result of the event function into firstForm
      //  calling then function, the paramater of the function becomes a JQuery object not cypress object (see above .find and hover for object description)
      // save text into variables, asserting using JQuery methods (.find)
      const emaillLabelFirst = firstForm.find('[for="inputEmail1"]').text();
      const passwordlLabelFirst = firstForm
        .find('[for="inputPassword2"]')
        .text();

      expect(emaillLabelFirst).to.equal("Email");
      expect(passwordlLabelFirst).to.equal("Password");

      cy.contains("nb-card", "Basic form").then((secondForm) => {
        // checking password on both forms match
        // ensuring scope of variables can be used in nested .thens
        const passwordLabelSecond = secondForm
          .find('[for="exampleInputPassword1"]')
          .text();
        expect(passwordlLabelFirst).to.equal(passwordLabelSecond);

        // convert code back to using cypress objects to use cypress methods, use cy.wrap():
        cy.wrap(secondForm)
          .find('[for="exampleInputPassword1"]')
          .should("contain", "Password");
      });
    });
  });

  it("invoke command", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    // 1
    cy.get('[for="exampleInputEmail1"]').should("contain", "Email address");

    // 2 - using JQuery object and methods
    cy.get('[for="exampleInputEmail1"]').then((label) => {
      expect(label.text()).to.equal("Email address");
    });

    // 3 - using cypress invoke method
    cy.get('[for="exampleInputEmail1"]')
      .invoke("text")
      .then((text) => {
        expect(text).to.equal("Email address");
      });

    // invoking a changing class attribute, example check for a checkbox is checked
    cy.contains("nb-card", "Basic form")
      .find("nb-checkbox")
      .click()
      .find(".custom-checkbox")
      .invoke("attr", "class")
      // two ways to assert:
      // 1 - using should
      // .should("contain", "checked");
      // 2. using then to extract the result of invoke function:
      .then((classValue) => {
        expect(classValue).to.contain("checked");
      });
  });

  it("assert property and web datepickers", () => {
    function selectDayFromCurrent(day) {
      // mocking the date so tests can pass no matter when they are run
      let date = new Date();
      date.setDate(date.getDate() + day);

      let futureDay = date.getDate();
      let futureMonth = date.toLocaleString("default", { month: "short" });
      let dateAssert =
        futureMonth + " " + futureDay + ", " + date.getFullYear();

      cy.get("nb-calendar-navigation")
        .invoke("attr", "ng-reflect-date")
        .then((dateAttribute) => {
          if (!dateAttribute.includes(futureMonth)) {
            cy.get('[data-name="chevron-right"]').click();
            selectDayFromCurrent(day);
          } else {
            cy.get('nb-calendar-day-picker [class="day-cell ng-star-inserted"]')
              .contains(futureDay)
              .click();
          }
        });
      return dateAssert;
    }

    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Datepicker").click();

    // date picker: verify date clicked. find value on property
    cy.contains("nb-card", "Common Datepicker")
      .find("input")
      .then((input) => {
        // input is a JQuery object so needs to be wrapped to convert it to a cypress object
        // in order to be able to use the cypress click function
        cy.wrap(input).click();
        let dateAssert = selectDayFromCurrent(200);

        // cy.get("nb-calendar-day-picker").contains("17").click();
        // cy.wrap(input)
        //   .invoke("prop", "value")
        //   // .should("contain", "Apr 17, 2023");
        //   .then((value) => {
        //     expect(value).to.equal(date);
        //   });

        cy.wrap(input).invoke("prop", "value").should("contain", dateAssert);
      });
  });

  it("radio button", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    cy.contains("nb-card", "Using the Grid")
      .find('[type="radio"]')
      .then((radioButtons) => {
        // check first radio button, {orce: true} is overriding the default of the visibilty being hidden
        cy.wrap(radioButtons).first().check({ force: true });
        // select second radio button
        cy.wrap(radioButtons)
          .eq(1) // checking for index 1
          .check({ force: true });
        // check the first radio is now unchecked
        cy.wrap(radioButtons).first().should("not.be.checked");

        //third radio button should be disabled
        cy.wrap(radioButtons).eq(2).should("be.disabled");
      });
  });

  it("checkboxes", () => {
    cy.visit("/");
    cy.contains("Modal & Overlays").click();
    cy.contains("Toastr").click();

    // check method will only check the boxes not uncheck, even if the box is already checked
    cy.get('[type="checkbox"]').check({ force: true });
    // click will uncheck
    cy.get('[type="checkbox"]').eq(0).click({ force: true });
  });

  it("lists and dropdowns", () => {
    cy.visit("/");

    //1 - hard coding values
    cy.get("nav nb-select").click();
    cy.get(".options-list").contains("Dark").click();
    cy.get("nb-layout-header").should("contain", "Dark");

    //check style to check theme has applied:
    cy.get("nb-layout-header nav").should(
      "have.css",
      "background-color",
      "rgb(34, 43, 69)"
    );

    //2 - looping through items
    cy.get("nav nb-select").then((dropdown) => {
      cy.wrap(dropdown).click();
      cy.get(".options-list nb-option").each((listItem, index) => {
        const itemText = listItem.text().trim();
        const colors = {
          Light: "rgb(255, 255, 255)",
          Dark: "rgb(34, 43, 69)",
          Cosmic: "rgb(50, 50, 89)",
          Corporate: "rgb(255, 255, 255)",
        };
        cy.wrap(listItem).click();
        cy.wrap(dropdown).should("contain", itemText);
        cy.get("nb-layout-header nav").should(
          "have.css",
          "background-color",
          colors[itemText]
        );
        if (index < 3) {
          cy.wrap(dropdown).click();
        }
      });
    });
  });

  it("web tables", () => {
    cy.visit("/");
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();

    //1
    cy.get("tbody")
      .contains("tr", "Larry")
      .then((tableRow) => {
        cy.wrap(tableRow).find(".nb-edit").click();
        cy.wrap(tableRow).find('[placeholder="Age"]').clear().type("25");
        cy.wrap(tableRow).find(".nb-checkmark").click();
        cy.wrap(tableRow).find("td").eq(6).should("contain", "25");
      });

    //2
    cy.get("thead").find(".nb-plus").click();
    cy.get("thead")
      .find("tr")
      .eq(2)
      .then((tableRow) => {
        cy.wrap(tableRow).find('[placeholder="First Name"]').type("John");
        cy.wrap(tableRow).find('[placeholder="Last Name"]').type("Smith");
        cy.wrap(tableRow).find(".nb-checkmark").click();
      });
    cy.get("tbody tr")
      .first()
      .find("td")
      .then((tableColumns) => {
        cy.wrap(tableColumns).eq(2).should("contain", "John");
        cy.wrap(tableColumns).eq(3).should("contain", "Smith");
      });

    //3
    const age = [20, 30, 40, 200];

    cy.wrap(age).each((age) => {
      cy.get('thead [placeholder="Age"]').clear().type(age);
      cy.wait(500);
      cy.get("tbody tr").each((tableRow) => {
        if (age == 200) {
          cy.wrap(tableRow).should("contain", "No data found");
        } else {
          cy.wrap(tableRow).find("td").eq(6).should("contain", age);
        }
      });
    });
  });

  it("Tooltips", () => {
    cy.visit("/");
    cy.contains("Modal & Overlays").click();
    cy.contains("Tooltip").click();

    cy.contains("nb-card", "Colored Tooltips").contains("Default").click();
    cy.get("nb-tooltip").should("contain", "This is a tooltip");
  });

  it("Modals", () => {
    cy.visit("/");
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();

    //1 - this approach doesnt catch if the window doesnt appear
    cy.get("tbody tr").first().find(".nb-trash").click();
    cy.on("window:confirm", (confirm) => {
      expect(confirm).to.equal("Are you sure you want to delete?");
    });

    //2 - better approach, confirming both window event and message
    const stub = cy.stub();
    cy.on("window:confirm", stub);
    cy.get("tbody tr")
      .first()
      .find(".nb-trash")
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith(
          "Are you sure you want to delete?"
        );
      });

    //3 - selecting cancel
    cy.get("tbody tr").first().find(".nb-trash").click();
    cy.on("window:confirm", () => false);
  });
});

import assert from "assert";

import { When, Then } from "@cucumber/cucumber";

interface MyWorld {
  whatIHeard: string;
}

// bad case
// const word = 'hello  cucumberjs';

// happy case
const word = 'hello';

When("the greeter says hello", function (this: MyWorld) {
  this.whatIHeard = word;
});

Then(
  "I should have heard {string}",
  function (this: MyWorld, expectedResponse: string) {
    assert.equal(this.whatIHeard, expectedResponse);
  }
);
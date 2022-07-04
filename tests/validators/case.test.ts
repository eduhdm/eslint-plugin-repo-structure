import validateCase from "#/validators/case";
import { DeclarationRule } from "#/types/rule-config";

describe("validate case", () => {
  it("should not validate if case is empty", () => {
    expect(() => validateCase("components", {})).not.toThrow();
  });

  it.each([
    ["PascalCase", "OrderController"],
    ["camelCase", "orderController"],
    ["snake_case", "order_controller"],
    ["kebab-case", "order-controller"],
    ["dash-case", "order-controller"],
  ])(
    "should not throw when case is %s and name is %s",
    (caseType: DeclarationRule["case"], moduleName: string) => {
      expect(() => validateCase(moduleName, { case: caseType })).not.toThrow();
    }
  );

  it.each([
    ["PascalCase", "orderController"],
    ["camelCase", "OrderController"],
    ["snake_case", "order-controller"],
    ["kebab-case", "order_controller"],
    ["dash-case", "order_controller"],
  ])(
    "should throw for invalid scenario: case is %s and name is: %s",
    (caseType: DeclarationRule["case"], moduleName: string) => {
      expect(() => validateCase(moduleName, { case: caseType })).toThrow(
        `Case is invalid: ${moduleName}, it should have ${caseType}`
      );
    }
  );

  it.each([
    ["PascalCase", "OrderController.js"],
    ["camelCase", "orderController.js"],
    ["snake_case", "order_controller.js"],
    ["kebab-case", "order-controller.js"],
    ["dash-case", "order-controller.js"],
  ])(
    "should not throw for valid scenario with file extension: case is %s and name is: %s",
    (caseType: DeclarationRule["case"], moduleName: string) => {
      expect(() => validateCase(moduleName, { case: caseType })).not.toThrow();
    }
  );
});

import validateName from "#/validators/name";

describe("validate name", () => {
  it("should validate fixed name", () => {
    expect(() =>
      validateName("components", { name: "components" })
    ).not.toThrow();
  });

  it("should throw error if fixed name is invalid", () => {
    expect(() => validateName("components", { name: "invalid-name" })).toThrow(
      "Folder name components is invalid. it should be invalid-name"
    );
  });

  it("should validate name pattern", () => {
    expect(() =>
      validateName("OrderController", { name: "/.*Controller$/" })
    ).not.toThrow();
  });

  it("should not run name validation if node config name is empty", () => {
    expect(() => validateName("OrderController", {})).not.toThrow();
  });

  it("should throw error when pattern does not match", () => {
    expect(() =>
      validateName("OrderControllers", { name: "/.*Controller$/" })
    ).toThrow(
      "Folder name OrderControllers is invalid. it should match /.*Controller$/"
    );
  });
});

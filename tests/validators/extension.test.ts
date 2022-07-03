import validateExtension from "#/validators/extension";
// import "@types/jest";

// jest.mock("module-alias/register");

describe("validate extension", () => {
  it("should now throw is extension is empty", () => {
    expect(() => validateExtension("components.js", {})).not.toThrow();
  });

  it("should throw error if extension is invalid", () => {
    expect(() =>
      validateExtension("components.js", { extension: ".ts" })
    ).toThrow("File name components.js should end with .ts");
  });

  it("should not throw error if extension is valid", () => {
    expect(() =>
      validateExtension("components.ts", { extension: ".ts" })
    ).not.toThrow();
  });

  it("should not throw error if extension is in array ", () => {
    expect(() =>
      validateExtension("components.ts", {
        extension: [".ts", ".js", ".tsx", ".jsx"],
      })
    ).not.toThrow();
  });

  it("should throw error if extension is not in array ", () => {
    expect(() =>
      validateExtension("components.css", {
        extension: [".ts", ".js", ".tsx", ".jsx"],
      })
    ).toThrow("File name components.css should end with .ts,.js,.tsx,.jsx");
  });
});

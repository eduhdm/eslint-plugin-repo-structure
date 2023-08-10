import { getNormalizedPath } from "#/rules/file-structure";

describe("getNormalizedPath()", () => {
  test("normalize path for windows dir", () => {
    expect(
      getNormalizedPath(
        "C:\\mydir\\windows\\my-project\\folder",
        "C:\\mydir\\windows",
        "\\"
      )
    ).toBe("root/my-project/folder");
  });

  test("normalize path for linux based dir", () => {
    expect(
      getNormalizedPath("/mydir/linux/my-project/folder", "/mydir/linux", "/")
    ).toBe("root/my-project/folder");
  });
});

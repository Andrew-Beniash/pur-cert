describe("Backend Structure", () => {
  it("should have required directories", () => {
    const fs = require("fs");
    const paths = [
      "./backend/src/routes",
      "./backend/src/controllers",
      "./backend/src/models",
      "./backend/src/middleware",
    ];

    paths.forEach((path) => {
      expect(fs.existsSync(path)).toBeTruthy();
    });
  });
});

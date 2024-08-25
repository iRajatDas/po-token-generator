module.exports = {
  preset: "jest-puppeteer",
  testEnvironment: "jest-environment-puppeteer",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  forceExit: true,
};

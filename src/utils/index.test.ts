import { hashUrl } from ".";

describe("hash url util function", () => {
  it("generate hash string", () => {
    const hash = hashUrl("https://google.com");
    expect(hash).toBe("https://google.com");
  });
});

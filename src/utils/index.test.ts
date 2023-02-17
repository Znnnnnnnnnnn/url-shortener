import { generateUUID } from ".";

describe("generate uuid for url", () => {
  it("output string should be case sensitive alphanumeric", () => {
    const uuid = generateUUID();

    expect(uuid).toMatch(/^[0-9a-zA-Z]+$/);
  });

  it("output string should have length of 6", () => {
    const uuid = generateUUID();

    expect(uuid).toHaveLength(6);
  });
});

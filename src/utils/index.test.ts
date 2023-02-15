import { hashUrl } from ".";

describe("hash url util fn", () => {
  it("output string should be hashed", () => {
    const url = "https://google.com";
    const hash = hashUrl(url);

    expect(hash).not.toBe(url);
  });

  it("output string should have length of 10", () => {
    const hash = hashUrl("https://google.com");

    expect(hash).toHaveLength(10);
  });

  it("two output string should be same when input string and secret are same", () => {
    const url = "https://google.com";
    const secret = "secret";
    const hash1 = hashUrl(url, secret);
    const hash2 = hashUrl(url, secret);

    expect(hash1).toBe(hash2);
  });

  it("two output string should be different when secrets are different", () => {
    const url = "https://google.com";
    const secret1 = "secret1";
    const secret2 = "secret2";
    const hash1 = hashUrl(url, secret1);
    const hash2 = hashUrl(url, secret2);

    expect(hash1).not.toBe(hash2);
  });
});

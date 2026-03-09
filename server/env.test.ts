import { describe, expect, it } from "vitest";

describe("Environment Variables", () => {
  it("should have MANUS_PASSWORD defined", () => {
    const password = process.env.MANUS_PASSWORD;
    expect(password).toBeDefined();
    expect(typeof password).toBe("string");
    expect(password!.length).toBeGreaterThan(0);
  });

  it("should have DEEPSEEK_API_TOKEN defined", () => {
    const token = process.env.DEEPSEEK_API_TOKEN;
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token!.length).toBeGreaterThan(0);
  });

  it("should validate password format (non-empty string)", () => {
    const password = process.env.MANUS_PASSWORD;
    expect(password).toMatch(/^.+$/);
  });

  it("should validate token format (non-empty string)", () => {
    const token = process.env.DEEPSEEK_API_TOKEN;
    expect(token).toMatch(/^.+$/);
  });
});

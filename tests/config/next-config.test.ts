import nextConfig from "../../next.config";

describe("next.config.ts", () => {
  it("disables poweredByHeader", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });

  it("configures remote image patterns for cdn.dummyjson.com", () => {
    expect(nextConfig.images?.remotePatterns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          protocol: "https",
          hostname: "cdn.dummyjson.com",
        }),
      ]),
    );
  });

  it("defines security headers including CSP, HSTS, and X-Content-Type-Options", async () => {
    expect(typeof nextConfig.headers).toBe("function");
    if (!nextConfig.headers) return;

    const headersList = await nextConfig.headers();
    expect(headersList).toHaveLength(1);
    expect(headersList[0].source).toBe("/:path*");

    const headerKeys = headersList[0].headers.map((h) => h.key);
    expect(headerKeys).toContain("X-Content-Type-Options");
    expect(headerKeys).toContain("Referrer-Policy");
    expect(headerKeys).toContain("Permissions-Policy");
    expect(headerKeys).toContain("Strict-Transport-Security");
    expect(headerKeys).toContain("Content-Security-Policy");
  });
});

import { getQueryClient } from "@/lib/query/query-client";

describe("getQueryClient", () => {
  it("configures sensible query defaults", () => {
    const client = getQueryClient();

    expect(client.getDefaultOptions().queries).toMatchObject({
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    });
  });

  it("returns a fresh client on every call", () => {
    expect(getQueryClient()).not.toBe(getQueryClient());
  });
});

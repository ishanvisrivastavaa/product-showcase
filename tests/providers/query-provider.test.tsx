import { render, screen } from "@testing-library/react";

import { QueryProvider } from "@/providers/query-provider";

describe("QueryProvider", () => {
  it("renders its children", () => {
    render(
      <QueryProvider>
        <p>Child content</p>
      </QueryProvider>,
    );

    expect(screen.getByText("Child content")).toBeInTheDocument();
  });
});

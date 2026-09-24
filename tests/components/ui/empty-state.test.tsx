import { render, screen } from "@testing-library/react";

import { EmptyState } from "@/components/ui/empty-state";

describe("EmptyState", () => {
  it("renders the title", () => {
    render(<EmptyState icon={<span />} title="No results found" />);

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("renders an optional description", () => {
    render(
      <EmptyState
        icon={<span />}
        title="No results found"
        description="Try a different search term."
      />,
    );

    expect(screen.getByText("Try a different search term.")).toBeInTheDocument();
  });

  it("omits the description when none is given", () => {
    render(<EmptyState icon={<span />} title="No results found" />);

    expect(screen.queryByText(/try a different/i)).not.toBeInTheDocument();
  });

  it("renders an optional action", () => {
    render(
      <EmptyState
        icon={<span />}
        title="No results found"
        action={<button type="button">Retry</button>}
      />,
    );

    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});

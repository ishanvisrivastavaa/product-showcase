import { render, screen } from "@testing-library/react";

import { QueryEmpty } from "@/components/query/query-empty";

describe("QueryEmpty", () => {
  it("uses a default title when none is given", () => {
    render(<QueryEmpty />);

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("renders a custom title, description, and action", () => {
    render(
      <QueryEmpty
        title="No products found"
        description="Try a different search."
        action={<button type="button">Clear filters</button>}
      />,
    );

    expect(screen.getByText("No products found")).toBeInTheDocument();
    expect(screen.getByText("Try a different search.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument();
  });
});

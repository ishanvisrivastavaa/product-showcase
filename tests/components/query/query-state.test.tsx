import { render, screen } from "@testing-library/react";

import { QueryState } from "@/components/query/query-state";

const props = {
  loadingFallback: <p>Loading…</p>,
  errorFallback: <p>Error!</p>,
  emptyFallback: <p>Empty!</p>,
  children: <p>Content</p>,
};

describe("QueryState", () => {
  it("renders the error fallback when isError is true, regardless of other flags", () => {
    render(<QueryState {...props} isLoading isError isEmpty />);

    expect(screen.getByText("Error!")).toBeInTheDocument();
  });

  it("renders the loading fallback when isLoading is true and there is no error", () => {
    render(<QueryState {...props} isLoading isError={false} isEmpty />);

    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders the empty fallback when isEmpty is true and not loading or errored", () => {
    render(<QueryState {...props} isLoading={false} isError={false} isEmpty />);

    expect(screen.getByText("Empty!")).toBeInTheDocument();
  });

  it("renders the children when none of the states apply", () => {
    render(
      <QueryState {...props} isLoading={false} isError={false} isEmpty={false} />,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

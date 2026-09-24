import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { QueryError } from "@/components/query/query-error";

describe("QueryError", () => {
  it("uses default title text and exposes an alert role", () => {
    render(<QueryError />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("shows a custom title and message", () => {
    render(
      <QueryError title="Failed to load products" message="Network error" />,
    );

    expect(screen.getByText("Failed to load products")).toBeInTheDocument();
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("only renders the retry button when onRetry is provided", () => {
    const { rerender } = render(<QueryError />);
    expect(
      screen.queryByRole("button", { name: "Try again" }),
    ).not.toBeInTheDocument();

    rerender(<QueryError onRetry={jest.fn()} />);
    expect(
      screen.getByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();
  });

  it("calls onRetry when the retry button is clicked", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    render(<QueryError onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

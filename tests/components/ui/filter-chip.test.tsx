import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FilterChip } from "@/components/ui/filter-chip";

describe("FilterChip", () => {
  it("shows the label and value", () => {
    render(<FilterChip label="Category" value="Beauty" onRemove={jest.fn()} />);

    expect(screen.getByText("Category:")).toBeInTheDocument();
    expect(screen.getByText("Beauty")).toBeInTheDocument();
  });

  it("calls onRemove when the remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = jest.fn();
    render(<FilterChip label="Category" value="Beauty" onRemove={onRemove} />);

    await user.click(
      screen.getByRole("button", { name: "Remove category filter" }),
    );

    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

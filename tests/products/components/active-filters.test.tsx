import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ActiveFilters } from "@/features/products/components/active-filters";

describe("ActiveFilters", () => {
  it("renders nothing when there are no active filters", () => {
    const { container } = render(
      <ActiveFilters filters={[]} onClearAll={jest.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a chip for every active filter", () => {
    render(
      <ActiveFilters
        filters={[
          {
            key: "search",
            label: "Search",
            value: "phone",
            onRemove: jest.fn(),
          },
          {
            key: "sort",
            label: "Sort",
            value: "Price: Low to High",
            onRemove: jest.fn(),
          },
        ]}
        onClearAll={jest.fn()}
      />,
    );

    expect(screen.getByText("phone")).toBeInTheDocument();
    expect(screen.getByText("Price: Low to High")).toBeInTheDocument();
  });

  it("calls the filter's own onRemove when its chip is dismissed", async () => {
    const user = userEvent.setup();
    const onRemoveSearch = jest.fn();
    render(
      <ActiveFilters
        filters={[
          {
            key: "search",
            label: "Search",
            value: "phone",
            onRemove: onRemoveSearch,
          },
        ]}
        onClearAll={jest.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Remove search filter" }),
    );

    expect(onRemoveSearch).toHaveBeenCalledTimes(1);
  });

  it("calls onClearAll when 'Clear all' is clicked", async () => {
    const user = userEvent.setup();
    const onClearAll = jest.fn();
    render(
      <ActiveFilters
        filters={[
          {
            key: "search",
            label: "Search",
            value: "phone",
            onRemove: jest.fn(),
          },
        ]}
        onClearAll={onClearAll}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Clear all" }));

    expect(onClearAll).toHaveBeenCalledTimes(1);
  });
});

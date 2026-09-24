import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createMockProduct } from "../../test-utils/mock-product";

import { ProductGrid } from "@/features/products/components/product-grid";

describe("ProductGrid", () => {
  it("renders a list item for every product", () => {
    const products = [
      createMockProduct({ id: 1, title: "Wireless Mouse" }),
      createMockProduct({ id: 2, title: "Mechanical Keyboard" }),
    ];

    render(
      <ProductGrid products={products} isLoading={false} isError={false} />,
    );

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Wireless Mouse")).toBeInTheDocument();
    expect(screen.getByText("Mechanical Keyboard")).toBeInTheDocument();
  });

  it("shows loading placeholders instead of products while loading", () => {
    const products = [createMockProduct({ id: 1, title: "Wireless Mouse" })];

    render(
      <ProductGrid products={products} isLoading isError={false} />,
    );

    expect(screen.queryByText("Wireless Mouse")).not.toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("shows an error state with a retry action when the query failed", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();

    render(
      <ProductGrid
        products={[]}
        isLoading={false}
        isError
        errorMessage="Network error"
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Failed to load products")).toBeInTheDocument();
    expect(screen.getByText("Network error")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("shows an empty state when there are no products and no error", () => {
    render(
      <ProductGrid
        products={[]}
        isLoading={false}
        isError={false}
        emptyTitle="No products found"
        emptyDescription="Try a different search term."
      />,
    );

    expect(screen.getByText("No products found")).toBeInTheDocument();
    expect(screen.getByText("Try a different search term.")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders a custom action in the empty state and wires it up", async () => {
    const user = userEvent.setup();
    const onClearFilters = jest.fn();

    render(
      <ProductGrid
        products={[]}
        isLoading={false}
        isError={false}
        emptyAction={
          <button type="button" onClick={onClearFilters}>
            Clear filters
          </button>
        }
      />,
    );

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });

  it("prioritizes the error state over the empty state when both are true", () => {
    render(<ProductGrid products={[]} isLoading={false} isError />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});

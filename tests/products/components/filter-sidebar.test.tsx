import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { ProductCategory } from "@/features/products/types/product.types";

import { SORT_OPTIONS } from "@/features/products/constants/sort-options";
import { FilterSidebar } from "@/features/products/components/filter-sidebar";

const categories: ProductCategory[] = [
  { slug: "beauty", name: "Beauty", url: "beauty" },
  { slug: "furniture", name: "Furniture", url: "furniture" },
];

const renderSidebar = (
  overrides: Partial<React.ComponentProps<typeof FilterSidebar>> = {},
) => {
  const props = {
    search: "",
    onSearchChange: jest.fn(),
    category: "",
    onCategoryChange: jest.fn(),
    sort: "featured",
    onSortChange: jest.fn(),
    minPrice: "",
    onMinPriceChange: jest.fn(),
    maxPrice: "",
    onMaxPriceChange: jest.fn(),
    categories,
    categoriesLoading: false,
    ...overrides,
  };
  render(<FilterSidebar {...props} />);
  return props;
};

describe("FilterSidebar", () => {
  it("reports each keystroke in the search box to the caller", async () => {
    const user = userEvent.setup();
    const props = renderSidebar();

    await user.type(screen.getByLabelText("Search products"), "p");

    expect(props.onSearchChange).toHaveBeenCalledWith("p");
  });

  it("marks 'All products' as selected when no category or search is active", () => {
    renderSidebar();

    expect(screen.getByRole("radio", { name: "All products" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("calls onCategoryChange with the category slug when an option is clicked", async () => {
    const user = userEvent.setup();
    const props = renderSidebar();

    await user.click(screen.getByRole("radio", { name: "Furniture" }));

    expect(props.onCategoryChange).toHaveBeenCalledWith("furniture");
  });

  it("marks the active category as selected instead of 'All products'", () => {
    renderSidebar({ category: "beauty" });

    expect(screen.getByRole("radio", { name: "Beauty" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "All products" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("shows a hint that search overrides category browsing while searching", () => {
    renderSidebar({ search: "shoes" });

    expect(
      screen.getByText("Search covers every category. Pick one to browse it."),
    ).toBeInTheDocument();
  });

  it("shows loading placeholders instead of category options while categories are loading", () => {
    renderSidebar({ categoriesLoading: true });

    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
  });

  it("lets the user pick a different sort option", async () => {
    const user = userEvent.setup();
    const props = renderSidebar();
    const priceAsc = SORT_OPTIONS.find(
      (option) => option.value === "price-asc",
    )!;

    await user.click(screen.getByRole("button", { name: "Sort products" }));
    await user.click(screen.getByRole("option", { name: priceAsc.label }));

    expect(props.onSortChange).toHaveBeenCalledWith("price-asc");
  });
});

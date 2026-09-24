jest.mock("../../../src/hooks", () => ({
  useProductDetail: jest.fn(),
  useProductCategory: jest.fn(),
}));

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useProductCategory, useProductDetail } from "@/hooks";
import { ProductDetail } from "@/features/products/components/product-detail";

import { createMockProduct } from "../../test-utils/mock-product";

const mockUseProductDetail = useProductDetail as jest.Mock;
const mockUseProductCategory = useProductCategory as jest.Mock;

const buildResult = (overrides: Record<string, unknown> = {}) => ({
  data: undefined,
  isPending: false,
  isError: false,
  refetch: jest.fn(),
  ...overrides,
});

beforeEach(() => {
  mockUseProductDetail.mockReset();
  mockUseProductCategory.mockReset();
  mockUseProductCategory.mockReturnValue(buildResult({ data: [] }));
});

describe("ProductDetail", () => {
  it("shows a skeleton while the product is loading", () => {
    mockUseProductDetail.mockReturnValue(buildResult({ isPending: true }));

    render(<ProductDetail id="1" />);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("shows an error state with a retry action when the request fails", async () => {
    const user = userEvent.setup();
    const refetch = jest.fn();
    mockUseProductDetail.mockReturnValue(
      buildResult({ isError: true, refetch }),
    );

    render(<ProductDetail id="1" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Failed to load product")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("renders the product once it has loaded", () => {
    const product = createMockProduct({ title: "Wireless Mouse", category: "electronics" });
    mockUseProductDetail.mockReturnValue(buildResult({ data: product }));

    render(<ProductDetail id="1" />);

    expect(screen.getByRole("heading", { name: "Wireless Mouse" })).toBeInTheDocument();
  });

  it("uses the real category name from the category list when available", () => {
    const product = createMockProduct({ category: "electronics" });
    mockUseProductDetail.mockReturnValue(buildResult({ data: product }));
    mockUseProductCategory.mockReturnValue(
      buildResult({ data: [{ slug: "electronics", name: "Electronics & Gadgets", url: "electronics" }] }),
    );

    render(<ProductDetail id="1" />);

    expect(screen.getAllByText("Electronics & Gadgets").length).toBeGreaterThan(0);
  });

  it("falls back to a formatted slug when the category list has no match", () => {
    const product = createMockProduct({ category: "home-decor" });
    mockUseProductDetail.mockReturnValue(buildResult({ data: product }));

    render(<ProductDetail id="1" />);

    expect(screen.getAllByText("Home Decor").length).toBeGreaterThan(0);
  });
});

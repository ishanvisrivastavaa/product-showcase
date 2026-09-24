import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProductTabs } from "@/features/products/components/product-tabs";

import { createMockProduct } from "../../test-utils/mock-product";

describe("ProductTabs", () => {
  it("shows the description and tags on the description tab", () => {
    const product = createMockProduct({
      description: "A great product.",
      tags: ["new", "sale"],
    });

    render(<ProductTabs product={product} />);

    expect(screen.getByText("A great product.")).toBeInTheDocument();
    expect(screen.getByText("#new")).toBeInTheDocument();
    expect(screen.getByText("#sale")).toBeInTheDocument();
  });

  it("omits the tag list when the product has no tags", () => {
    render(<ProductTabs product={createMockProduct({ tags: [] })} />);

    expect(screen.queryByText(/^#/)).not.toBeInTheDocument();
  });

  it("shows derived specification rows on the specifications tab", async () => {
    const user = userEvent.setup();
    const product = createMockProduct({ brand: "Logitech", sku: "SKU-1" });

    render(<ProductTabs product={product} />);
    await user.click(screen.getByRole("tab", { name: "Specifications" }));

    expect(screen.getByText("Logitech")).toBeInTheDocument();
    expect(screen.getByText("SKU-1")).toBeInTheDocument();
  });

  it("falls back to an em dash when the product has no brand", async () => {
    const user = userEvent.setup();
    render(<ProductTabs product={createMockProduct({ brand: "" })} />);

    await user.click(screen.getByRole("tab", { name: "Specifications" }));

    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("lists reviews on the reviews tab when there are any", async () => {
    const user = userEvent.setup();
    const product = createMockProduct({
      reviews: [
        {
          rating: 5,
          comment: "Loved it",
          date: "2024-01-01T00:00:00.000Z",
          reviewerName: "Jane Doe",
          reviewerEmail: "jane@example.com",
        },
      ],
    });

    render(<ProductTabs product={product} />);
    await user.click(screen.getByRole("tab", { name: "Reviews (1)" }));

    expect(screen.getByText("Loved it")).toBeInTheDocument();
  });

  it("shows a fallback message when there are no reviews", async () => {
    const user = userEvent.setup();
    render(<ProductTabs product={createMockProduct({ reviews: [] })} />);

    await user.click(screen.getByRole("tab", { name: "Reviews (0)" }));

    expect(screen.getByText("No reviews yet.")).toBeInTheDocument();
  });
});

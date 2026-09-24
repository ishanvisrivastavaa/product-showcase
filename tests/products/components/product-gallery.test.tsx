import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProductGallery } from "@/features/products/components/product-gallery";

describe("ProductGallery", () => {
  it("shows the fallback image and no controls when there are no images", () => {
    render(
      <ProductGallery
        images={[]}
        fallbackImage="https://example.com/fallback.jpg"
        title="Wireless Mouse"
      />,
    );

    expect(screen.getByAltText("Wireless Mouse - image 1")).toHaveAttribute(
      "src",
      expect.stringContaining("fallback.jpg"),
    );
    expect(
      screen.queryByRole("button", { name: "Next image" }),
    ).not.toBeInTheDocument();
  });

  it("shows navigation controls and a counter when there are multiple images", () => {
    render(
      <ProductGallery
        images={["https://example.com/a.jpg", "https://example.com/b.jpg"]}
        fallbackImage="https://example.com/fallback.jpg"
        title="Wireless Mouse"
      />,
    );

    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next image" }),
    ).toBeInTheDocument();
  });

  it("moves to the next image when the next arrow is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ProductGallery
        images={["https://example.com/a.jpg", "https://example.com/b.jpg"]}
        fallbackImage="https://example.com/fallback.jpg"
        title="Wireless Mouse"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Next image" }));

    expect(screen.getByText("2 / 2")).toBeInTheDocument();
  });

  it("wraps around to the last image when going previous from the first", async () => {
    const user = userEvent.setup();
    render(
      <ProductGallery
        images={["https://example.com/a.jpg", "https://example.com/b.jpg"]}
        fallbackImage="https://example.com/fallback.jpg"
        title="Wireless Mouse"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Previous image" }));

    expect(screen.getByText("2 / 2")).toBeInTheDocument();
  });

  it("wraps around to the first image when going next from the last", async () => {
    const user = userEvent.setup();
    render(
      <ProductGallery
        images={["https://example.com/a.jpg", "https://example.com/b.jpg"]}
        fallbackImage="https://example.com/fallback.jpg"
        title="Wireless Mouse"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Next image" }));
    await user.click(screen.getByRole("button", { name: "Next image" }));

    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  it("jumps to the clicked thumbnail", async () => {
    const user = userEvent.setup();
    render(
      <ProductGallery
        images={["https://example.com/a.jpg", "https://example.com/b.jpg"]}
        fallbackImage="https://example.com/fallback.jpg"
        title="Wireless Mouse"
      />,
    );

    await user.click(screen.getByRole("button", { name: "View image 2" }));

    expect(screen.getByText("2 / 2")).toBeInTheDocument();
  });
});

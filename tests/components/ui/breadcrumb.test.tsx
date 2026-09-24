import { render, screen } from "@testing-library/react";

import { Breadcrumb } from "@/components/ui/breadcrumb";

describe("Breadcrumb", () => {
  it("renders a link for every item except the last", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Products", href: "/" },
          { label: "Beauty", href: "/?category=beauty" },
          { label: "Lipstick" },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Beauty" })).toHaveAttribute(
      "href",
      "/?category=beauty",
    );
  });

  it("renders the last item as plain text marked as the current page", () => {
    render(
      <Breadcrumb items={[{ label: "Products", href: "/" }, { label: "Lipstick" }]} />,
    );

    expect(screen.queryByRole("link", { name: "Lipstick" })).not.toBeInTheDocument();
    expect(screen.getByText("Lipstick")).toHaveAttribute("aria-current", "page");
  });

  it("renders a single item without crashing", () => {
    render(<Breadcrumb items={[{ label: "Home" }]} />);

    expect(screen.getByText("Home")).toHaveAttribute("aria-current", "page");
  });
});

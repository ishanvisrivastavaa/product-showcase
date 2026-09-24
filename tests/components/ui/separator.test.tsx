import { render, screen } from "@testing-library/react";

import { Separator } from "@/components/ui/separator";

describe("Separator", () => {
  it("defaults to a horizontal orientation", () => {
    render(<Separator />);

    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
  });

  it("supports a vertical orientation", () => {
    render(<Separator orientation="vertical" />);

    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
  });
});

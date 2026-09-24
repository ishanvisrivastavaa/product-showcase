import { render, screen } from "@testing-library/react";

import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge>New</Badge>);

    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies a custom className alongside the variant styling", () => {
    render(<Badge className="mt-1">Sale</Badge>);

    expect(screen.getByText("Sale")).toHaveClass("mt-1");
  });
});

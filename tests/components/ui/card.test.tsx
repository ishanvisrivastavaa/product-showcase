import { render, screen } from "@testing-library/react";

import { Card } from "@/components/ui/card";

describe("Card", () => {
  it("renders its children", () => {
    render(<Card>Content</Card>);

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("forwards extra props such as role and aria-label to the underlying element", () => {
    render(
      <Card role="region" aria-label="Summary">
        Content
      </Card>,
    );

    expect(screen.getByRole("region", { name: "Summary" })).toBeInTheDocument();
  });
});

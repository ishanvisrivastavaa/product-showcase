import { render, screen } from "@testing-library/react";

import { Tooltip } from "@/components/ui/tooltip";

describe("Tooltip", () => {
  it("renders its trigger children and the tooltip label", () => {
    render(
      <Tooltip label="Previous image">
        <button type="button">Prev</button>
      </Tooltip>,
    );

    expect(screen.getByRole("button", { name: "Prev" })).toBeInTheDocument();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Previous image");
  });
});

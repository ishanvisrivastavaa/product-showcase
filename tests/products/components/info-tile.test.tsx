import { render, screen } from "@testing-library/react";

import { InfoTile } from "@/features/products/components/info-tile";

describe("InfoTile", () => {
  it("renders the label and value", () => {
    render(<InfoTile icon={<span />} label="Shipping" value="Ships in 1 day" />);

    expect(screen.getByText("Shipping")).toBeInTheDocument();
    expect(screen.getByText("Ships in 1 day")).toBeInTheDocument();
  });
});

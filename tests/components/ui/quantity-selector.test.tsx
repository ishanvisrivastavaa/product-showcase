import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { QuantitySelector } from "@/components/ui/quantity-selector";

describe("QuantitySelector", () => {
  it("displays the current value", () => {
    render(<QuantitySelector value={3} onChange={jest.fn()} max={10} />);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calls onChange with value + 1 when increased", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<QuantitySelector value={3} onChange={onChange} max={10} />);

    await user.click(screen.getByRole("button", { name: "Increase quantity" }));

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("calls onChange with value - 1 when decreased", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<QuantitySelector value={3} onChange={onChange} max={10} />);

    await user.click(screen.getByRole("button", { name: "Decrease quantity" }));

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("disables the decrease button at the minimum", () => {
    render(<QuantitySelector value={1} onChange={jest.fn()} max={10} />);

    expect(
      screen.getByRole("button", { name: "Decrease quantity" }),
    ).toBeDisabled();
  });

  it("disables the increase button at the maximum", () => {
    render(<QuantitySelector value={5} onChange={jest.fn()} max={5} />);

    expect(
      screen.getByRole("button", { name: "Increase quantity" }),
    ).toBeDisabled();
  });

  it("respects a custom minimum", () => {
    render(<QuantitySelector value={2} min={2} onChange={jest.fn()} max={10} />);

    expect(
      screen.getByRole("button", { name: "Decrease quantity" }),
    ).toBeDisabled();
  });

  it("uses the given accessible label for the group", () => {
    render(
      <QuantitySelector
        value={1}
        onChange={jest.fn()}
        max={5}
        label="Quantity for Wireless Mouse"
      />,
    );

    expect(
      screen.getByRole("group", { name: "Quantity for Wireless Mouse" }),
    ).toBeInTheDocument();
  });
});

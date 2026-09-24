import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RadioGroup, RadioOption } from "@/components/ui/radio";

describe("RadioGroup / RadioOption", () => {
  it("exposes a radiogroup with the given accessible label", () => {
    render(
      <RadioGroup label="Category">
        <RadioOption label="All products" selected onSelect={jest.fn()} />
      </RadioGroup>,
    );

    expect(screen.getByRole("radiogroup", { name: "Category" })).toBeInTheDocument();
  });

  it("marks the selected option as checked and others as unchecked", () => {
    render(
      <RadioGroup label="Category">
        <RadioOption label="All products" selected onSelect={jest.fn()} />
        <RadioOption label="Beauty" selected={false} onSelect={jest.fn()} />
      </RadioGroup>,
    );

    expect(screen.getByRole("radio", { name: "All products" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Beauty" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("calls onSelect when an option is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    render(
      <RadioGroup label="Category">
        <RadioOption label="Beauty" selected={false} onSelect={onSelect} />
      </RadioGroup>,
    );

    await user.click(screen.getByRole("radio", { name: "Beauty" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

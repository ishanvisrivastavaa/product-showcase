import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PriceRangeFilter } from "@/features/products/components/price-range-filter";

const renderFilter = (
  overrides: Partial<React.ComponentProps<typeof PriceRangeFilter>> = {},
) => {
  const props = {
    min: "",
    max: "",
    onMinChange: jest.fn(),
    onMaxChange: jest.fn(),
    ...overrides,
  };
  render(<PriceRangeFilter {...props} />);
  return props;
};

describe("PriceRangeFilter", () => {
  it("renders the current min and max values", () => {
    renderFilter({ min: "10", max: "250" });

    expect(screen.getByLabelText("Minimum price")).toHaveValue("10");
    expect(screen.getByLabelText("Maximum price")).toHaveValue("250");
  });

  it("reports typed minimum prices to the caller", async () => {
    const user = userEvent.setup();
    const props = renderFilter();

    await user.type(screen.getByLabelText("Minimum price"), "5");

    expect(props.onMinChange).toHaveBeenCalledWith("5");
  });

  it("reports typed maximum prices to the caller", async () => {
    const user = userEvent.setup();
    const props = renderFilter();

    await user.type(screen.getByLabelText("Maximum price"), "9");

    expect(props.onMaxChange).toHaveBeenCalledWith("9");
  });

  it("accepts a decimal point", async () => {
    const user = userEvent.setup();
    const props = renderFilter({ min: "9" });

    await user.type(screen.getByLabelText("Minimum price"), ".");

    expect(props.onMinChange).toHaveBeenCalledWith("9.");
  });
});

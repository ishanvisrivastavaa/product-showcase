import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Select } from "@/components/ui/select";

const options = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

describe("Select", () => {
  it("shows the label of the currently selected option", () => {
    render(
      <Select
        value="featured"
        options={options}
        onValueChange={jest.fn()}
        aria-label="Sort products"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Sort products" }),
    ).toHaveTextContent("Featured");
  });

  it("opens the listbox when the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Select
        value="featured"
        options={options}
        onValueChange={jest.fn()}
        aria-label="Sort products"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Sort products" }));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("calls onValueChange and closes when an option is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    render(
      <Select
        value="featured"
        options={options}
        onValueChange={onValueChange}
        aria-label="Sort products"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Sort products" }));
    await user.click(
      screen.getByRole("option", { name: "Price: Low to High" }),
    );

    expect(onValueChange).toHaveBeenCalledWith("price-asc");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens the listbox with the ArrowDown key on the trigger", async () => {
    const user = userEvent.setup();
    render(
      <Select
        value="featured"
        options={options}
        onValueChange={jest.fn()}
        aria-label="Sort products"
      />,
    );

    screen.getByRole("button", { name: "Sort products" }).focus();
    await user.keyboard("{ArrowDown}");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("selects the active option with Enter", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    render(
      <Select
        value="featured"
        options={options}
        onValueChange={onValueChange}
        aria-label="Sort products"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Sort products" }));
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onValueChange).toHaveBeenCalledWith("price-asc");
  });

  it("closes without changing the value when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    render(
      <Select
        value="featured"
        options={options}
        onValueChange={onValueChange}
        aria-label="Sort products"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Sort products" }));
    await user.keyboard("{Escape}");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes when clicking outside the control", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Select
          value="featured"
          options={options}
          onValueChange={jest.fn()}
          aria-label="Sort products"
        />
        <button type="button">Outside</button>
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "Sort products" }));
    await user.click(screen.getByRole("button", { name: "Outside" }));

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

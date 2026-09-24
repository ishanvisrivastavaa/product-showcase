import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchInput } from "@/components/ui/search-input";

describe("SearchInput", () => {
  it("renders a search input with the given placeholder", () => {
    render(
      <SearchInput placeholder="Search products..." aria-label="Search" />,
    );

    expect(
      screen.getByPlaceholderText("Search products..."),
    ).toBeInTheDocument();
  });

  it("reports keystrokes through onChange", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<SearchInput aria-label="Search" onChange={onChange} />);

    await user.type(screen.getByLabelText("Search"), "a");

    expect(onChange).toHaveBeenCalled();
  });
});

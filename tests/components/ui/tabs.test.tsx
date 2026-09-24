import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tabs } from "@/components/ui/tabs";

const items = [
  { id: "description", label: "Description", content: <p>Description panel</p> },
  { id: "specs", label: "Specifications", content: <p>Specs panel</p> },
  { id: "reviews", label: "Reviews", content: <p>Reviews panel</p> },
];

describe("Tabs", () => {
  it("shows the first tab's panel by default", () => {
    render(<Tabs items={items} />);

    expect(screen.getByText("Description panel")).toBeVisible();
    expect(screen.getByText("Specs panel")).not.toBeVisible();
  });

  it("switches panels when a tab is clicked", async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} />);

    await user.click(screen.getByRole("tab", { name: "Specifications" }));

    expect(screen.getByText("Specs panel")).toBeVisible();
    expect(screen.getByText("Description panel")).not.toBeVisible();
  });

  it("marks only the active tab as selected", async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} />);

    await user.click(screen.getByRole("tab", { name: "Reviews" }));

    expect(screen.getByRole("tab", { name: "Reviews" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Description" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("moves to the next tab with ArrowRight, wrapping around at the end", async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} />);

    screen.getByRole("tab", { name: "Reviews" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByText("Description panel")).toBeVisible();
  });

  it("moves to the previous tab with ArrowLeft, wrapping around at the start", async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} />);

    screen.getByRole("tab", { name: "Description" }).focus();
    await user.keyboard("{ArrowLeft}");

    expect(screen.getByText("Reviews panel")).toBeVisible();
  });
});

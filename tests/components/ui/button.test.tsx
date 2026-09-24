import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button, buttonClasses } from "@/components/ui/button";

describe("Button", () => {
  it("renders its children and responds to clicks", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Button onClick={onClick} disabled>
        Save
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards a ref to the underlying button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("defaults to type=button so it never submits a form", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });
});

describe("buttonClasses", () => {
  it("merges a custom className with the base and variant/size classes", () => {
    const classes = buttonClasses({ className: "mt-4" });

    expect(classes).toContain("mt-4");
  });

  it("lets a custom className override a conflicting default utility", () => {
    // The default size classes include h-10; a custom h-20 should win.
    const classes = buttonClasses({ size: "md", className: "h-20" });

    expect(classes).toContain("h-20");
    expect(classes).not.toContain("h-10");
  });
});

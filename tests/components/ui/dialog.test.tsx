import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dialog } from "@/components/ui/dialog";

describe("Dialog", () => {
  it("does not render a backdrop when closed", () => {
    const { container } = render(
      <Dialog open={false} onClose={jest.fn()} aria-label="Filters">
        <p>Panel content</p>
      </Dialog>,
    );

    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it("renders a backdrop when open", () => {
    const { container } = render(
      <Dialog open onClose={jest.fn()} aria-label="Filters">
        <p>Panel content</p>
      </Dialog>,
    );

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it("shows the panel when open", () => {
    render(
      <Dialog open onClose={jest.fn()} aria-label="Filters">
        <p>Panel content</p>
      </Dialog>,
    );

    expect(screen.getByRole("dialog", { name: "Filters" })).toBeVisible();
    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("calls onClose when the backdrop is clicked", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const { container } = render(
      <Dialog open onClose={onClose} aria-label="Filters">
        <p>Panel content</p>
      </Dialog>,
    );

    const backdrop = container.querySelector('[aria-hidden="true"]');
    await user.click(backdrop as Element);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the Escape key is pressed", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose} aria-label="Filters">
        <p>Panel content</p>
      </Dialog>,
    );

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not listen for Escape while closed", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Dialog open={false} onClose={onClose} aria-label="Filters">
        <p>Panel content</p>
      </Dialog>,
    );

    await user.keyboard("{Escape}");

    expect(onClose).not.toHaveBeenCalled();
  });
});

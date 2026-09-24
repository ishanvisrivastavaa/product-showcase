import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Toaster, useToast } from "@/components/ui/toast";

beforeEach(() => {
  useToast.setState({ toast: null });
});

describe("Toaster", () => {
  it("renders nothing when there is no active toast", () => {
    render(<Toaster />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows the toast message once one is set", () => {
    render(<Toaster />);

    act(() => {
      useToast.getState().showToast({ message: "Item added to cart" });
    });

    expect(screen.getByRole("status")).toHaveTextContent("Item added to cart");
  });

  it("shows the optional link when provided", () => {
    render(<Toaster />);

    act(() => {
      useToast.getState().showToast({
        message: "Item added",
        link: { href: "/cart", label: "View cart" },
      });
    });

    expect(screen.getByRole("link", { name: "View cart" })).toHaveAttribute(
      "href",
      "/cart",
    );
  });

  it("dismisses the toast when the close button is clicked", async () => {
    const user = userEvent.setup();
    render(<Toaster />);

    act(() => {
      useToast.getState().showToast({ message: "Item added" });
    });
    await user.click(
      screen.getByRole("button", { name: "Dismiss notification" }),
    );

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("auto-dismisses the toast after 3 seconds", () => {
    jest.useFakeTimers();
    render(<Toaster />);

    act(() => {
      useToast.getState().showToast({ message: "Item added" });
    });
    expect(screen.getByRole("status")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    jest.useRealTimers();
  });
});

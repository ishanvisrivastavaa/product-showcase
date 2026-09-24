let mockPathname = "/";

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

import { render } from "@testing-library/react";

import { ScrollToTop } from "@/providers/scroll-to-top";

beforeEach(() => {
  mockPathname = "/";
  window.scrollTo = jest.fn();
});

describe("ScrollToTop", () => {
  it("scrolls to the top on mount", () => {
    render(<ScrollToTop />);

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("scrolls to the top again when the route changes", () => {
    const { rerender } = render(<ScrollToTop />);
    (window.scrollTo as jest.Mock).mockClear();

    mockPathname = "/product/1";
    rerender(<ScrollToTop />);

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("renders nothing", () => {
    const { container } = render(<ScrollToTop />);

    expect(container).toBeEmptyDOMElement();
  });
});

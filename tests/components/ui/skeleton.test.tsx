import { render } from "@testing-library/react";

import { Skeleton } from "@/components/ui/skeleton";

describe("Skeleton", () => {
  it("renders a placeholder element with a custom className", () => {
    const { container } = render(<Skeleton className="h-4 w-full" />);

    expect(container.firstChild).toHaveClass("h-4", "w-full");
  });
});

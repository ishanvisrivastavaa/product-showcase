import { render, screen } from "@testing-library/react";

import { ReviewItem } from "@/features/products/components/review-item";

describe("ReviewItem", () => {
  it("shows the reviewer's initials, name, date, and comment", () => {
    render(
      <ReviewItem
        review={{
          rating: 5,
          comment: "Great product!",
          date: "2024-03-15T00:00:00.000Z",
          reviewerName: "Jane Doe",
          reviewerEmail: "jane@example.com",
        }}
      />,
    );

    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Great product!")).toBeInTheDocument();
    expect(screen.getByText("Mar 15, 2024")).toBeInTheDocument();
  });

  it("uses a single initial for a one-word name", () => {
    render(
      <ReviewItem
        review={{
          rating: 3,
          comment: "It's fine.",
          date: "2024-01-01T00:00:00.000Z",
          reviewerName: "Cher",
          reviewerEmail: "cher@example.com",
        }}
      />,
    );

    expect(screen.getByText("C")).toBeInTheDocument();
  });
});

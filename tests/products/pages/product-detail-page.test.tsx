import { notFound } from "next/navigation";

import ProductPage, {
  generateMetadata,
} from "@/app/product/[id]/page";
import { getProduct } from "@/services";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("../../../src/services", () => ({
  getProduct: jest.fn(),
}));

jest.mock("../../../src/features/products", () => ({
  ProductDetail: ({ id }: { id: string }) => <div>Product Detail {id}</div>,
}));

describe("ProductPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls notFound() when id is not a number", async () => {
    await expect(
      ProductPage({ params: Promise.resolve({ id: "abc" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("calls notFound() when id is negative or zero", async () => {
    await expect(
      ProductPage({ params: Promise.resolve({ id: "-5" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    await expect(
      ProductPage({ params: Promise.resolve({ id: "0" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("calls notFound() when product fetch fails", async () => {
    (getProduct as jest.Mock).mockRejectedValue(new Error("API Error"));

    await expect(
      ProductPage({ params: Promise.resolve({ id: "9999" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders successfully for a valid positive id", async () => {
    (getProduct as jest.Mock).mockResolvedValue({
      id: 42,
      title: "Test Product",
      description: "Test Desc",
    });

    const jsx = await ProductPage({ params: Promise.resolve({ id: "42" }) });
    expect(jsx).toBeDefined();
    expect(getProduct).toHaveBeenCalledWith("42");
  });

  it("returns fallback metadata when id is invalid", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ id: "invalid" }),
    });
    expect(meta).toEqual({ title: "Product Not Found" });
  });

  it("returns product metadata when id is valid", async () => {
    (getProduct as jest.Mock).mockResolvedValue({
      id: 42,
      title: "Test Product",
      description: "Test description",
    });

    const meta = await generateMetadata({
      params: Promise.resolve({ id: "42" }),
    });
    expect(meta).toEqual({
      title: "Test Product | Product Showcase",
      description: "Test description",
    });
  });
});

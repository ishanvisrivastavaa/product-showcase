import type { Product } from "@/features/products/types/product.types";

export const createMockProduct = (
  overrides: Partial<Product> = {},
): Product => ({
  id: 1,
  title: "Test Product",
  description: "A product used for testing.",
  category: "test-category",
  price: 100,
  discountPercentage: 0,
  rating: 4.5,
  stock: 20,
  tags: ["test"],
  brand: "TestBrand",
  sku: "TEST-SKU-1",
  weight: 1,
  dimensions: { width: 10, height: 10, depth: 10 },
  warrantyInformation: "1 year warranty",
  shippingInformation: "Ships in 1 day",
  availabilityStatus: "In Stock",
  reviews: [],
  returnPolicy: "30 days return",
  minimumOrderQuantity: 1,
  meta: {
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    barcode: "0000000000000",
    qrCode: "https://example.com/qr",
  },
  thumbnail: "https://example.com/thumbnail.jpg",
  images: ["https://example.com/image-1.jpg"],
  ...overrides,
});

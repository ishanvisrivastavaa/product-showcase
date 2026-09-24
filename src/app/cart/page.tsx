import { CartView } from "@/features/cart";

const CartPage = () => (
  <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
    <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
      Shopping cart
    </h1>
    <CartView />
  </div>
);

export default CartPage;

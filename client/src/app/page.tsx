// app/page.tsx (the main homepage)
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="text-gray-800">
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 text-center py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900">
            Welcome to Mini Store
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Your one-stop shop for the best products online. Discover quality
            and style in every click.
          </p>
          <div className="mt-8">
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Why Shop With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="p-6">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-500">
                We source the best products to ensure you get top-notch quality
                every time.
              </p>
            </div>

            <div className="p-6">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-500">
                Your order gets to you quickly and reliably, wherever you are.
              </p>
            </div>

            <div className="p-6">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-500">
                Shop with confidence using our secure and encrypted payment
                gateway.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

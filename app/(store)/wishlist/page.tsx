'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import PageHero from '@/components/PageHero';
import { pageHeroImage } from '@/lib/page-hero-images';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function WishlistPage() {
  usePageTitle('Wishlist');
  const { wishlist: wishlistItems } = useWishlist();
  const { addToCart } = useCart();

  const addAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => item.inStock);
    inStockItems.forEach(item => {
      // Convert WishlistItem to CartItem if necessary, or assume compatibility
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        slug: item.slug || item.id, // Fallback
        maxStock: 99 // Default
      });
    });
    if (inStockItems.length > 0) {
      alert(`Added ${inStockItems.length} items to cart`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <PageHero title="My Wishlist" backgroundImage={pageHeroImage('wishlist')} />

      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center space-x-2 text-sm mb-2">
                <Link href="/" className="text-gray-600 hover:text-blue-700 transition-colors">Home</Link>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
                <span className="text-gray-900 font-medium">Wishlist</span>
              </nav>
              <p className="text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <button
                onClick={addAllToCart}
                className="bg-gray-900 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
              >
                Add All to Cart
              </button>
            )}
          </div>
        </div>
      </section>

      {wishlistItems.length === 0 ? (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6 bg-gray-200 rounded-full">
              <i className="ri-heart-line text-5xl text-gray-400"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">Save your favourite items here to easily find them later</p>
            <Link href="/shop" className="inline-block bg-gray-900 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors whitespace-nowrap">
              Explore Products
            </Link>
          </div>
        </section>
      ) : (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {wishlistItems.map((product) => (
                <ProductCard key={product.id} {...product} slug={product.slug || product.id} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 border-t border-black/[0.04] bg-stone-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-[2rem] bg-gradient-to-br from-blue-950 via-blue-950 to-blue-900 px-6 py-14 md:px-10 md:py-16 text-center shadow-[0_20px_60px_-30px_rgba(2,6,23,0.65)] border border-blue-900/60">
            <div className="mb-6 flex justify-center">
              <span className="w-14 h-14 rounded-2xl bg-blue-900/40 border border-blue-800/70 flex items-center justify-center">
                <i className="ri-share-line text-2xl text-blue-100/90 font-light"></i>
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif text-white mb-4">Share your wishlist</h2>
            <p className="text-blue-100/70 mb-10 text-sm md:text-base font-light">
              Let friends and family know what you love.
            </p>
            <div className="flex justify-center items-center gap-4 md:gap-5">
              <button className="w-14 h-14 rounded-full border border-blue-800/80 bg-blue-900/30 text-blue-200 hover:text-white hover:border-pink-400 hover:bg-pink-500/20 hover:-translate-y-1 transform transition-all duration-300 flex items-center justify-center">
                <i className="ri-facebook-fill text-2xl"></i>
              </button>
              <button className="w-14 h-14 rounded-full border border-blue-800/80 bg-blue-900/30 text-blue-200 hover:text-white hover:border-pink-400 hover:bg-pink-500/20 hover:-translate-y-1 transform transition-all duration-300 flex items-center justify-center">
                <i className="ri-twitter-x-fill text-2xl"></i>
              </button>
              <button className="w-14 h-14 rounded-full border border-blue-800/80 bg-blue-900/30 text-blue-200 hover:text-white hover:border-pink-400 hover:bg-pink-500/20 hover:-translate-y-1 transform transition-all duration-300 flex items-center justify-center">
                <i className="ri-whatsapp-fill text-2xl"></i>
              </button>
              <button className="w-14 h-14 rounded-full border border-blue-800/80 bg-blue-900/30 text-blue-200 hover:text-white hover:border-pink-400 hover:bg-pink-500/20 hover:-translate-y-1 transform transition-all duration-300 flex items-center justify-center">
                <i className="ri-mail-fill text-2xl"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

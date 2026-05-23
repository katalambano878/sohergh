'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import MiniCart from './MiniCart';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { useCMS } from '@/context/CMSContext';
import { SITE_NAME, SITE_LOGO_PATH } from '@/lib/site-defaults';
import AnnouncementBar from './AnnouncementBar';

export default function Header() {
  interface SearchProduct {
    id: string;
    name: string;
    slug?: string | null;
    image?: string;
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const { cartCount, isCartOpen, setIsCartOpen } = useCart();
  const { getSetting } = useCMS();

  const siteName = getSetting('site_name') || SITE_NAME;
  const headerLogo = getSetting('site_logo') || SITE_LOGO_PATH;

  useEffect(() => {
    // Wishlist logic
    const updateWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(wishlist.length);
    };

    updateWishlistCount();
    window.addEventListener('wishlistUpdated', updateWishlistCount);

    // Auth logic
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('wishlistUpdated', updateWishlistCount);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isSearchOpen) return;

    const query = searchQuery.trim();
    if (query.length < 1) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Prefix search: products that start with what the user is typing.
        const { data, error } = await supabase
          .from('products')
          .select('id,name,slug,product_images(url,position)')
          .ilike('name', `${query}%`)
          .order('name', { ascending: true })
          .limit(8);

        if (error) {
          console.error('Search query failed:', error);
          setSearchResults([]);
          return;
        }

        const formatted: SearchProduct[] = (data || []).map((item: any) => {
          const firstImage = (item.product_images || [])
            .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))[0];

          return {
            id: item.id,
            name: item.name,
            slug: item.slug,
            image: firstImage?.url
          };
        });

        setSearchResults(formatted);
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [searchQuery, isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const goToSearchResults = () => {
    const query = searchQuery.trim();
    if (!query) return;
    window.location.href = `/shop?search=${encodeURIComponent(query)}`;
  };

  return (
    <>
      <AnnouncementBar />

      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-black/[0.04] transition-all duration-500">
        <div className="safe-area-top" />
        <nav aria-label="Main navigation" className="relative">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="h-[82px] flex items-center justify-between">

              {/* Left: Mobile Menu Trigger (Mobile) & Logo */}
              <div className="flex items-center gap-4 z-10 w-1/4">
                <button
                  className="lg:hidden py-2 pr-4 -ml-2 text-black/60 hover:text-black transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <i className="ri-menu-line text-2xl"></i>
                </button>
                <Link
                  href="/"
                  className="flex items-center select-none opacity-90 hover:opacity-100 transition-opacity duration-500"
                  aria-label="Go to homepage"
                >
                  <img src={headerLogo} alt={siteName} className="h-8 md:h-10 w-auto object-contain object-left" />
                </Link>
              </div>

              {/* Center: Navigation Links (Desktop) */}
              <div className="hidden lg:flex flex-1 absolute inset-0 items-center justify-center pointer-events-none z-0">
                <div className="pointer-events-auto flex items-center space-x-10">
                  {[
                    { label: 'Shop', href: '/shop' },
                    { label: 'Categories', href: '/categories' },
                    { label: 'About', href: '/about' },
                    { label: 'Contact', href: '/contact' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group relative py-2 text-[11px] md:text-[12px] uppercase tracking-[0.2em] font-medium text-black/50 transition-colors duration-500 hover:text-black"
                    >
                      {link.label}
                      <span className="absolute inset-x-0 -bottom-1 h-[1px] scale-x-0 bg-black/20 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] origin-center group-hover:scale-x-100" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right: Icons */}
              <div className="flex items-center justify-end space-x-5 z-10 w-1/4">
                <button
                  className="text-black/60 hover:text-black transition-colors duration-500 flex items-center"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search"
                >
                  <i className="ri-search-line text-[1.35rem]"></i>
                </button>

                <Link
                  href="/wishlist"
                  className="text-black/60 hover:text-black transition-colors duration-500 relative hidden sm:flex items-center"
                  aria-label="Wishlist"
                >
                  <i className="ri-heart-line text-[1.35rem]"></i>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-black text-[9px] font-medium text-white shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {user ? (
                  <Link
                    href="/account"
                    className="text-black/60 hover:text-black transition-colors duration-500 hidden sm:flex items-center"
                    aria-label="Account"
                  >
                    <i className="ri-user-line text-[1.35rem]"></i>
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    className="text-black/60 hover:text-black transition-colors duration-500 hidden sm:flex items-center"
                    aria-label="Login"
                  >
                    <i className="ri-user-line text-[1.35rem]"></i>
                  </Link>
                )}

                <div className="relative flex items-center">
                  <button
                    className="text-black/60 hover:text-black transition-colors duration-500 flex items-center"
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    aria-label="Cart"
                  >
                    <i className="ri-shopping-bag-line text-[1.35rem]"></i>
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-black text-[9px] font-medium text-white shadow-sm">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                </div>
              </div>

            </div>
          </div>
        </nav>
      </header>

      {/* Search Overlay */}
      <div 
        className={`fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] flex flex-col items-center justify-center ${isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="w-full max-w-4xl px-6 relative" style={{ transform: isSearchOpen ? 'translateY(0)' : 'translateY(20px)', transition: 'transform 0.7s ease-[cubic-bezier(0.19,1,0.22,1)]' }}>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="absolute -top-16 right-0 md:-right-8 w-12 h-12 flex items-center justify-center text-black/30 hover:text-black hover:rotate-90 transition-all duration-500"
            aria-label="Close search"
          >
            <i className="ri-close-line text-4xl"></i>
          </button>
          
          <p className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-black/40 mb-8 text-center font-medium">Search the collection</p>
          
          <form onSubmit={handleSearch} className="w-full relative group">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full bg-transparent border-0 border-b border-black/10 text-2xl md:text-5xl font-light text-black placeholder:text-black/15 px-0 py-4 focus:ring-0 focus:border-black transition-colors duration-500 focus:outline-none text-center"
            />
          </form>

          {searchQuery.trim().length > 0 && (
            <div className="mt-6 max-w-2xl mx-auto rounded-2xl border border-black/10 bg-white/95 backdrop-blur-md overflow-hidden shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)]">
              {isSearching ? (
                <div className="px-5 py-4 text-sm text-black/50 text-center">Searching products...</div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="max-h-[320px] overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug || product.id}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-black/[0.03] transition-colors border-b border-black/[0.05] last:border-0"
                      >
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-black/30">
                              <i className="ri-image-line text-lg"></i>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm md:text-base text-black/85 font-medium truncate">{product.name}</p>
                          <p className="text-xs text-black/45">View product</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="px-4 py-3 bg-black/[0.02] border-t border-black/[0.06]">
                    <button
                      type="button"
                      onClick={goToSearchResults}
                      className="w-full text-sm font-medium text-black/70 hover:text-black transition-colors"
                    >
                      See all results for "{searchQuery.trim()}"
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-5 py-4 text-sm text-black/50 text-center">
                  No products found starting with "{searchQuery.trim()}".
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
        <div 
          className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-6 flex items-center justify-between border-b border-black/[0.03]">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="opacity-90 hover:opacity-100 transition-opacity">
              <img src={headerLogo} alt={siteName} className="h-8 w-auto object-contain object-left" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 -mr-2 text-black/40 hover:text-black transition-colors"
              aria-label="Close menu"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-10 space-y-10">
            <div className="space-y-6">
              {[
                { label: 'Home', href: '/' },
                { label: 'Shop', href: '/shop' },
                { label: 'Categories', href: '/categories' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-2xl font-light text-black/70 hover:text-black transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-8 border-t border-black/[0.03] space-y-5">
              {[
                { label: 'Track Order', href: '/order-tracking' },
                { label: 'Wishlist', href: '/wishlist' },
                { label: 'My Account', href: '/account' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-xs font-medium tracking-widest uppercase text-black/50 hover:text-black transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="p-6 border-t border-black/[0.03]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/30 text-center">
              &copy; {new Date().getFullYear()} {siteName}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
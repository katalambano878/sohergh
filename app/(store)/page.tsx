'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import ProductCard, { type ColorVariant, getColorHex } from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import AnimatedSection, { AnimatedGrid } from '@/components/AnimatedSection';
import NewsletterSection from '@/components/NewsletterSection';
import { usePageTitle } from '@/hooks/usePageTitle';

const HERO_SLIDES = [
  {
    imageSrc: '/hero-1.png',
    imageAlt: 'SoHer GH — natural curls and premium hair',
    tag: 'SoHer GH',
    heading: <>Premium hair <br /><span className="hero-title-accent font-semibold text-pink-200 tracking-tight">&amp; wigs</span></>,
    subtext: 'Quality textures and styles — trusted by stylists and shoppers across Ghana.',
    cta: { text: 'Shop now', href: '/shop' },
    cta2: { text: 'Categories', href: '/categories' },
  },
  {
    imageSrc: '/hero-2.png',
    imageAlt: 'SoHer — glamorous waves and bold style',
    tag: 'SoHer Beauty',
    heading: <>Glamour <br /><span className="hero-title-accent font-semibold text-amber-200 tracking-tight">that shines</span></>,
    subtext: 'Makeup, skincare, and hair — your all-in-one beauty destination.',
    cta: { text: 'Browse shop', href: '/shop' },
    cta2: { text: 'Our story', href: '/about' },
  },
  {
    imageSrc: '/hero-3.png',
    imageAlt: 'SoHer GH — salon-quality hair',
    tag: 'Salon quality',
    heading: <>Expert-loved <br /><span className="hero-title-accent font-semibold text-emerald-200 tracking-tight">textures</span></>,
    subtext: 'Shop wigs, bundles, and accessories with the look and feel you expect in-store.',
    cta: { text: 'New arrivals', href: '/shop?sort=newest' },
    cta2: { text: 'Contact', href: '/contact' },
  },
] as const;

const HERO_AUTOPLAY_MS = 4500;

export default function Home() {
  usePageTitle('');
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Config State - Managed in Code
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [canHoverPause, setCanHoverPause] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setCanHoverPause(media.matches);
    apply();

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', apply);
      return () => media.removeEventListener('change', apply);
    }

    media.addListener(apply);
    return () => media.removeListener(apply);
  }, []);

  useEffect(() => {
    if (isHeroPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, HERO_AUTOPLAY_MS);

    return () => clearInterval(interval);
  }, [isHeroPaused]);

  const config: {
    banners?: Array<{ text: string; active: boolean }>;
  } = {
    banners: [
      { text: '🚚 Free delivery on orders over GH₵ 500 in select areas!', active: false },
      { text: '✨ New stock arriving this weekend - Pre-order now!', active: false },
      { text: '💳 Secure payments via Mobile Money & Card', active: false }
    ]
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          supabase
            .from('products')
            .select('*, categories(name), product_variants(*), product_images(*)')
            .eq('status', 'active')
            .eq('featured', true)
            .order('created_at', { ascending: false })
            .limit(8),
          supabase
            .from('categories')
            .select('id, name, slug, image_url, metadata')
            .eq('status', 'active')
            .order('name'),
        ]);

        if (productsRes.error) {
          console.warn('Home featured products fetch failed:', {
            message: productsRes.error.message,
            details: productsRes.error.details,
            hint: productsRes.error.hint,
            code: productsRes.error.code,
          });
          setFeaturedProducts([]);
        } else {
          setFeaturedProducts(productsRes.data || []);
        }

        if (categoriesRes.error) {
          console.warn('Home categories fetch failed:', {
            message: categoriesRes.error.message,
            details: categoriesRes.error.details,
            hint: categoriesRes.error.hint,
            code: categoriesRes.error.code,
          });
          setCategories([]);
        } else {
          // Filter by metadata.featured = true on client side
          const featuredCategories = (categoriesRes.data || []).filter(
            (cat: any) => cat.metadata?.featured === true
          );
          setCategories(featuredCategories);
        }
      } catch (error) {
        console.warn('Home page fetchData failed unexpectedly:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  const renderBanners = () => {
    const activeBanners = config.banners?.filter(b => b.active) || [];
    if (activeBanners.length === 0) return null;

    return (
      <div className="bg-blue-900 text-white py-2 overflow-hidden relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {activeBanners.concat(activeBanners).map((banner, index) => (
            <span key={index} className="mx-8 text-sm font-medium tracking-wide flex items-center">
              {banner.text}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="flex-col items-center justify-between min-h-screen">
      {renderBanners()}

      {/* Hero Section - God Level Design */}
      <section
        className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden bg-black"
        onMouseEnter={() => {
          if (canHoverPause) setIsHeroPaused(true);
        }}
        onMouseLeave={() => {
          if (canHoverPause) setIsHeroPaused(false);
        }}
      >

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-white/10">
          <div
            key={currentSlide}
            className="h-full bg-white/80 animate-progress origin-left"
            style={{
              animationDuration: `${HERO_AUTOPLAY_MS}ms`,
              animationPlayState: isHeroPaused ? 'paused' : 'running',
            }}
          ></div>
        </div>

        {/* Background slider — photos in public/hero-1.png … hero-3.png */}
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.imageSrc}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 overflow-hidden bg-neutral-950">
              <Image
                src={slide.imageSrc}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                quality={88}
                className={`object-cover object-[55%_center] sm:object-center ${index === currentSlide ? 'animate-ken-burns' : ''}`}
              />
            </div>

            {/* Readability: stronger veil on the left where headline sits */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 md:via-black/35 to-black/20" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" aria-hidden />

            {/* Slide content — centered in the hero */}
            <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-10 md:px-16 lg:px-20 max-w-7xl mx-auto w-full h-full">
              <div className="w-full max-w-xl md:max-w-2xl text-center mx-auto">
                <div
                  className={`overflow-hidden transition-all duration-700 delay-100 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                  <span className="hero-subtitle-font inline-block py-1 px-4 mb-5 text-white/90 text-xs md:text-sm tracking-[0.25em] uppercase font-semibold border border-white/25 rounded-full backdrop-blur-md bg-white/10">
                    {slide.tag}
                  </span>
                </div>

                <div className={`transition-all duration-700 delay-200 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <h1 className="hero-title-font text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-5 md:mb-6 leading-[1.08] tracking-tight drop-shadow-2xl">
                    {slide.heading}
                  </h1>
                </div>

                <div className={`transition-all duration-700 delay-300 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <p className="hero-subtitle-font text-base sm:text-lg md:text-xl text-gray-100/95 mb-8 md:mb-10 font-medium leading-relaxed max-w-xl mx-auto">
                    {slide.subtext}
                  </p>
                </div>

                <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-5 transition-all duration-700 delay-400 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <Link
                    href={slide.cta.href}
                    className="group relative px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-gray-950 rounded-full font-medium text-base sm:text-lg text-center overflow-hidden transition-all hover:shadow-[0_0_24px_rgba(255,255,255,0.45)] hover:bg-gray-100 hover:scale-[1.02]"
                  >
                    <span className="relative z-10 inline-flex items-center justify-center gap-2 w-full">
                      {slide.cta.text} <i className="ri-arrow-right-line transition-transform group-hover:translate-x-1"></i>
                    </span>
                  </Link>
                  <Link
                    href={slide.cta2.href}
                    className="group px-8 sm:px-10 py-3.5 sm:py-4 bg-white/10 border border-white/35 text-white rounded-full font-medium text-base sm:text-lg text-center backdrop-blur-md hover:bg-white/20 hover:border-white/55 transition-all hover:scale-[1.02]"
                  >
                    {slide.cta2.text}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators - God Level Horizon Pagination */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-end gap-2 drop-shadow-sm">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentSlide(i);
                setIsHeroPaused(false);
              }}
              className="relative flex flex-col items-center justify-end h-10 cursor-pointer group px-1"
              aria-label={`Go to slide ${i + 1}`}
            >
              <div 
                className={`text-[9px] font-serif tracking-[0.2em] mb-1.5 transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] pointer-events-none ${
                  currentSlide === i 
                    ? 'text-white opacity-100 translate-y-0 scale-100' 
                    : 'text-white opacity-0 translate-y-2 scale-95 group-hover:opacity-60 group-hover:translate-y-1'
                }`}
              >
                0{i + 1}
              </div>
              
              <div 
                className={`h-[1.5px] transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] rounded-full ${
                  currentSlide === i 
                    ? 'w-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                    : 'w-3 bg-white/40 group-hover:w-4 group-hover:bg-white/70'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Decoration */}
        <div className="absolute bottom-10 right-6 md:right-16 z-20 hidden md:block">
          <div className="text-white/40 text-sm font-light tracking-widest vertical-text transform rotate-180" style={{ writingMode: 'vertical-rl' }}>
            SOHER GH
          </div>
        </div>

      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14">
            <div>
              <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full bg-slate-50 border border-slate-100">
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.15em] text-slate-500 uppercase">Collections</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                Shop by{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-950 via-blue-800 to-indigo-500">
                  Category
                </span>
              </h2>
            </div>
            <Link href="/categories" className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full border border-slate-200 text-sm font-bold text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
              Explore All <i className="ri-arrow-right-up-line ml-2"></i>
            </Link>
          </AnimatedSection>

          <AnimatedGrid className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {categories.map((category) => (
              <Link href={`/shop?category=${category.slug}`} key={category.id} className="group cursor-pointer block relative">
                <div className="aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-lg transition-all duration-500 bg-stone-100">
                  <Image
                    src={category.image || category.image_url || 'https://via.placeholder.com/600x800?text=' + encodeURIComponent(category.name)}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    quality={85}
                    loading="lazy"
                  />
                  {/* Bottom overlay to support title + hover subtext */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/88 via-black/28 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end">
                    <h3 className="font-semibold text-white text-[18px] sm:text-[20px] drop-shadow-md leading-[1.15] tracking-tight transition-transform duration-300 group-hover:-translate-y-1">
                      {category.name}
                    </h3>
                    <span className="mt-1.5 inline-flex items-center gap-1.5 text-white/90 text-xs sm:text-sm font-medium opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      Browse Collection
                      <i className="ri-arrow-right-line text-sm"></i>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </AnimatedGrid>

          <div className="mt-10 md:hidden flex justify-center">
            <Link href="/categories" className="inline-flex items-center px-6 py-3 rounded-full border border-slate-200 text-sm font-bold text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
              Explore All <i className="ri-arrow-right-up-line ml-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Top picks from our latest arrivals</p>
          </AnimatedSection>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <AnimatedGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map((product) => {
                const variants = product.product_variants || [];
                const hasVariants = variants.length > 0;
                const minVariantPrice = hasVariants ? Math.min(...variants.map((v: any) => v.price || product.price)) : undefined;
                const totalVariantStock = hasVariants ? variants.reduce((sum: number, v: any) => sum + (v.quantity || 0), 0) : 0;
                const effectiveStock = hasVariants ? totalVariantStock : product.quantity;

                // Extract unique colors from option2
                const colorVariants: ColorVariant[] = [];
                const seenColors = new Set<string>();
                for (const v of variants) {
                  const colorName = (v as any).option2;
                  if (colorName && !seenColors.has(colorName.toLowerCase().trim())) {
                    const hex = getColorHex(colorName);
                    if (hex) {
                      seenColors.add(colorName.toLowerCase().trim());
                      colorVariants.push({ name: colorName.trim(), hex });
                    }
                  }
                }

                const cat = product.categories as { name?: string } | { name?: string }[] | null | undefined;
                const categoryName = Array.isArray(cat) ? cat[0]?.name : cat?.name;

                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.compare_at_price}
                    image={product.product_images?.[0]?.url || 'https://via.placeholder.com/400x500'}
                    rating={product.rating_avg || 5}
                    reviewCount={product.review_count || 0}
                    badge={product.featured ? 'Featured' : undefined}
                    inStock={effectiveStock > 0}
                    maxStock={effectiveStock || 50}
                    moq={product.moq || 1}
                    hasVariants={hasVariants}
                    minVariantPrice={minVariantPrice}
                    colorVariants={colorVariants}
                    category={categoryName}
                  />
                );
              })}
            </AnimatedGrid>
          )}

          <div className="text-center mt-16">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-gray-900 text-white px-10 py-4 rounded-full font-medium hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 btn-animate"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter - Homepage Only */}
      <NewsletterSection />

    </main>
  );
}

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { pageHeroImage } from '@/lib/page-hero-images';

export const revalidate = 0; // Ensure fresh data on every visit

export default async function CategoriesPage() {
  const { data: categoriesData } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      description,
      image_url,
      position
    `)
    .eq('status', 'active')
    .order('position', { ascending: true });

  // Muted palette for subtle, premium accents
  const palette = [
    { color: 'from-slate-500 to-slate-700', icon: 'ri-store-2-line' },
    { color: 'from-slate-600 to-slate-800', icon: 'ri-shopping-bag-3-line' },
    { color: 'from-zinc-500 to-zinc-700', icon: 'ri-t-shirt-line' },
    { color: 'from-stone-500 to-stone-700', icon: 'ri-home-smile-line' },
    { color: 'from-neutral-500 to-neutral-700', icon: 'ri-heart-line' },
    { color: 'from-gray-500 to-gray-700', icon: 'ri-star-smile-line' },
  ];

  const categories = categoriesData?.map((c, i) => {
    const style = palette[i % palette.length];
    return {
      ...c,
      image: c.image_url || 'https://via.placeholder.com/600x400?text=Category',
      color: style.color,
      icon: style.icon,
      // Optional: Fetch product count if needed, currently skipping for performance/simplicity
      productCount: 'Browse',
    };
  }) || [];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Shop by Category"
        subtitle="Browse the catalog by category"
        backgroundImage={pageHeroImage('categories')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group relative isolate overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_50px_-28px_rgba(15,23,42,0.45)]"
              >
                <div className="relative h-44 md:h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover scale-[1.02] group-hover:scale-[1.08] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-black/5 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/18 via-transparent to-transparent"></div>
                </div>

                <div className="p-5 md:p-6">
                  <div className="flex items-center gap-3 mb-3.5">
                    <div className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50/90 flex items-center justify-center transition-colors duration-300 group-hover:bg-white">
                      <i className={`${category.icon} text-[17px] text-slate-700`}></i>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-[22px] font-semibold tracking-tight text-slate-900">{category.name}</h3>
                      <p className="text-[11px] tracking-[0.14em] uppercase text-slate-500">Collection</p>
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed text-sm mb-5 line-clamp-2">
                    {category.description || 'Explore our exclusive collection in this category.'}
                  </p>

                  <div className="inline-flex items-center text-slate-800 font-medium text-sm gap-1.5 transition-all group-hover:gap-2">
                    <span className="relative">
                      Browse Collection
                      <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-slate-800 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                    <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-0.5"></i>
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-70" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <i className="ri-inbox-line text-5xl text-gray-300 mb-4"></i>
            <p className="text-xl text-gray-500">No categories found.</p>
          </div>
        )}
      </div>

      <div className="bg-stone-50 py-20 md:py-24 border-t border-black/[0.03]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-[2rem] border border-black/[0.07] bg-white px-6 py-12 md:px-10 md:py-14 text-center shadow-[0_20px_60px_-35px_rgba(0,0,0,0.2)]">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-black mb-6 drop-shadow-sm">Can't find what you're looking for?</h2>
            <p className="text-sm md:text-base text-black/50 font-light mb-12 leading-relaxed">
              Try our advanced search or contact our team for personalised product recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                href="/shop"
                className="group flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 rounded-full bg-white border border-black/[0.12] text-[10px] md:text-xs tracking-[0.25em] uppercase font-medium text-black/70 hover:text-black hover:border-black/30 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <i className="ri-search-line text-base text-black/30 group-hover:text-black/60 transition-colors"></i>
                <span>Search Products</span>
              </Link>
              <Link
                href="/contact"
                className="group flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 rounded-full bg-black border border-black text-[10px] md:text-xs tracking-[0.25em] uppercase font-medium text-white/90 hover:bg-black/90 hover:text-white transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
              >
                <i className="ri-customer-service-line text-base text-white/50 group-hover:text-white transition-colors"></i>
                <span>Contact Support</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import { money } from '@/lib/format-money';

import { useState } from 'react';
import Link from 'next/link';
import LazyImage from './LazyImage';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

// Map common color names to hex values for swatches
const COLOR_MAP: Record<string, string> = {
  black: '#000000', white: '#FFFFFF', red: '#EF4444', blue: '#3B82F6',
  navy: '#1E3A5F', green: '#22C55E', yellow: '#EAB308', orange: '#F97316',
  pink: '#EC4899', purple: '#A855F7', brown: '#92400E', beige: '#D4C5A9',
  grey: '#6B7280', gray: '#6B7280', cream: '#FFFDD0', teal: '#14B8A6',
  maroon: '#800000', coral: '#FF7F50', burgundy: '#800020', olive: '#808000',
  tan: '#D2B48C', khaki: '#C3B091', charcoal: '#36454F', ivory: '#FFFFF0',
  gold: '#FFD700', silver: '#C0C0C0', rose: '#FF007F', lavender: '#E6E6FA',
  mint: '#98FB98', peach: '#FFDAB9', wine: '#722F37', denim: '#1560BD',
  nude: '#E3BC9A', camel: '#C19A6B', sage: '#BCB88A', rust: '#B7410E',
  mustard: '#FFDB58', plum: '#8E4585', lilac: '#C8A2C8', stone: '#928E85',
  sand: '#C2B280', taupe: '#483C32', mauve: '#E0B0FF', sky: '#87CEEB',
  forest: '#228B22', cobalt: '#0047AB', emerald: '#50C878', scarlet: '#FF2400',
  aqua: '#00FFFF', turquoise: '#40E0D0', indigo: '#4B0082', crimson: '#DC143C',
  magenta: '#FF00FF', cyan: '#00FFFF', chocolate: '#7B3F00', coffee: '#6F4E37',
};

export function getColorHex(colorName: string): string | null {
  const lower = colorName.toLowerCase().trim();
  if (COLOR_MAP[lower]) return COLOR_MAP[lower];
  for (const [key, val] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

export interface ColorVariant {
  name: string;
  hex: string;
}

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  inStock?: boolean;
  maxStock?: number;
  moq?: number;
  hasVariants?: boolean;
  minVariantPrice?: number;
  colorVariants?: ColorVariant[];
  /** Category label under the title (e.g. from join). */
  category?: string;
}

export default function ProductCard({
  id,
  slug,
  name,
  price,
  originalPrice,
  image,
  badge,
  inStock = true,
  maxStock = 50,
  moq = 1,
  hasVariants = false,
  minVariantPrice,
  colorVariants = [],
  category,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [activeColor, setActiveColor] = useState<string | null>(null);

  const displayPrice = hasVariants && minVariantPrice != null ? minVariantPrice : price;
  const showCompare =
    originalPrice != null &&
    originalPrice > displayPrice;

  const MAX_SWATCHES = 5;

  const formatPrice = (val: number) => `GH\u20B5${money(val)}`;

  const pillButtonClass =
    'shrink-0 rounded-full border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:opacity-45 disabled:pointer-events-none';

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(id)) {
      removeFromWishlist(id);
      return;
    }
    addToWishlist({
      id,
      name,
      price: displayPrice,
      originalPrice: showCompare ? originalPrice : undefined,
      image,
      inStock,
      slug,
    });
  };

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-[28px] bg-[#F5F7FA]">
        <Link href={`/product/${slug}`} className="relative block h-full w-full">
          <LazyImage
            src={image}
            alt={name}
            className="h-full w-full"
            objectFit="cover"
            objectPosition="object-top"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          />
        </Link>

        <button
          type="button"
          onClick={toggleWishlist}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-black shadow-sm transition-colors hover:bg-slate-50"
          aria-label={isInWishlist(id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <i
            className={`text-lg ${isInWishlist(id) ? 'ri-heart-fill text-red-500' : 'ri-heart-line text-neutral-600'}`}
          />
        </button>

        {badge && (
          <span className="absolute left-3 top-3 z-10 rounded-md border border-[#E2E8F0] bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-black">
            {badge}
          </span>
        )}

        {!inStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[28px] bg-white/70 backdrop-blur-[2px]">
            <span className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <Link href={`/product/${slug}`} className="block">
          <h3 className="line-clamp-2 font-sans text-base font-bold leading-snug text-black">
            {name}
          </h3>
        </Link>

        {category ? (
          <p className="mt-1 text-sm font-normal text-[#888888]">{category}</p>
        ) : null}

        {colorVariants.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {colorVariants.slice(0, MAX_SWATCHES).map((color) => (
              <button
                key={color.name}
                title={color.name}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveColor(activeColor === color.name ? null : color.name);
                }}
                className={`h-4 w-4 shrink-0 rounded-full border transition-all duration-200 ${
                  activeColor === color.name
                    ? 'scale-110 ring-2 ring-black ring-offset-1'
                    : 'hover:scale-110'
                } ${color.hex === '#FFFFFF' ? 'border-gray-300' : 'border-transparent'}`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {colorVariants.length > MAX_SWATCHES && (
              <span className="text-xs text-[#888888]">+{colorVariants.length - MAX_SWATCHES}</span>
            )}
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="min-w-0 flex flex-wrap items-baseline gap-2">
            {hasVariants && minVariantPrice != null ? (
              <span className="font-sans text-base font-bold text-black">
                From {formatPrice(minVariantPrice)}
              </span>
            ) : (
              <span className="font-sans text-base font-bold text-black">{formatPrice(price)}</span>
            )}
            {showCompare && (
              <span className="text-sm font-normal text-[#888888] line-through">
                {formatPrice(originalPrice!)}
              </span>
            )}
          </div>

          <div className="shrink-0">
            {hasVariants ? (
              <Link href={`/product/${slug}`} className={`inline-flex items-center justify-center ${pillButtonClass}`}>
                Select options
              </Link>
            ) : (
              <button
                type="button"
                disabled={!inStock}
                onClick={(e) => {
                  e.preventDefault();
                  addToCart({ id, name, price, image, quantity: moq, slug, maxStock, moq });
                }}
                className={`inline-flex items-center justify-center ${pillButtonClass}`}
              >
                {moq > 1 ? `Add ${moq} to cart` : 'Add to cart'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

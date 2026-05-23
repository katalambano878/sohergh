export default function ProductCardSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-[28px] bg-[#F5F7FA]">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-white to-slate-100" style={{ backgroundSize: '200% 100%' }} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col space-y-2">
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-1/3 rounded bg-slate-100" />

        <div className="mt-2 flex gap-1.5">
          <div className="h-4 w-4 rounded-full bg-slate-200" />
          <div className="h-4 w-4 rounded-full bg-slate-200" />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div className="flex items-baseline gap-2">
            <div className="h-5 w-20 rounded bg-slate-200" />
            <div className="h-4 w-14 rounded bg-slate-100" />
          </div>
          <div className="h-10 w-[7.5rem] shrink-0 rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

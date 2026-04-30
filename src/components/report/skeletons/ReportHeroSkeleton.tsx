'use client';

export function ReportHeroSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl animate-pulse space-y-4 rounded-3xl bg-white/5 p-6">
      <div className="h-4 w-32 rounded-full bg-white/10" />
      <div className="h-8 w-3/4 rounded-full bg-white/15" />
      <div className="h-4 w-2/3 rounded-full bg-white/10" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-20 rounded-2xl bg-white/10" />
        <div className="h-20 rounded-2xl bg-white/10" />
        <div className="h-20 rounded-2xl bg-white/10" />
      </div>
      <div className="h-24 rounded-2xl bg-white/10" />
    </div>
  );
}

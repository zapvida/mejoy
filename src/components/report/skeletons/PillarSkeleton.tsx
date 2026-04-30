'use client';

export function PillarSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="h-6 w-1/2 rounded-full bg-white/10" />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-full rounded-full bg-white/10" />
            <div className="h-4 w-5/6 rounded-full bg-white/10" />
            <div className="h-4 w-4/6 rounded-full bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

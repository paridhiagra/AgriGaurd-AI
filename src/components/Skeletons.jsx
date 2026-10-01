import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-margin space-y-space-md animate-pulse">
      {/* Top greeting skeleton */}
      <div className="flex items-center justify-between pt-1">
        <div className="space-y-2">
          <div className="h-6 w-40 bg-surface-container-high/60 rounded-lg"></div>
          <div className="h-4 w-56 bg-surface-container-high/40 rounded-lg"></div>
        </div>
        <div className="h-7 w-28 bg-surface-container-high/60 rounded-full"></div>
      </div>

      {/* AI Hero Card Skeleton */}
      <div className="rounded-3xl bg-surface-container-lowest p-6 border border-surface-container-high/50 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high/80"></div>
            <div className="space-y-1.5">
              <div className="h-4 w-32 bg-surface-container-high/70 rounded"></div>
              <div className="h-3 w-20 bg-surface-container-high/40 rounded"></div>
            </div>
          </div>
          <div className="h-6 w-24 bg-surface-container-high/60 rounded-full"></div>
        </div>

        <div className="h-8 w-3/4 bg-surface-container-high/80 rounded-xl"></div>
        <div className="h-14 w-full bg-surface-container-low/70 rounded-2xl"></div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="h-11 bg-surface-container-high/50 rounded-xl"></div>
          <div className="h-11 bg-surface-container-high/70 rounded-xl"></div>
        </div>
      </div>

      {/* Bento Grid 3 cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="h-32 bg-surface-container-lowest rounded-2xl border border-surface-container-high/50 p-3 space-y-2">
          <div className="h-6 w-6 bg-surface-container-high/70 rounded-lg"></div>
          <div className="h-3 w-16 bg-surface-container-high/50 rounded"></div>
          <div className="h-7 w-12 bg-surface-container-high/80 rounded"></div>
        </div>
        <div className="h-32 bg-surface-container-lowest rounded-2xl border border-surface-container-high/50 p-3 space-y-2">
          <div className="h-6 w-6 bg-surface-container-high/70 rounded-lg"></div>
          <div className="h-3 w-16 bg-surface-container-high/50 rounded"></div>
          <div className="h-7 w-12 bg-surface-container-high/80 rounded"></div>
        </div>
        <div className="h-32 bg-surface-container-lowest rounded-2xl border border-surface-container-high/50 p-3 space-y-2">
          <div className="h-6 w-6 bg-surface-container-high/70 rounded-lg"></div>
          <div className="h-3 w-16 bg-surface-container-high/50 rounded"></div>
          <div className="h-7 w-12 bg-surface-container-high/80 rounded"></div>
        </div>
      </div>

      {/* Water tank skeleton */}
      <div className="h-24 bg-surface-container-lowest rounded-2xl border border-surface-container-high/50 p-4"></div>
    </div>
  );
}

export function WeatherSkeleton() {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-margin space-y-space-md animate-pulse">
      <div className="h-6 w-48 bg-surface-container-high/70 rounded-lg"></div>
      <div className="h-44 bg-surface-container-lowest rounded-3xl border border-surface-container-high/50 p-5 space-y-3">
        <div className="h-10 w-24 bg-surface-container-high/80 rounded-xl"></div>
        <div className="h-4 w-40 bg-surface-container-high/50 rounded"></div>
        <div className="h-16 w-full bg-surface-container-low rounded-xl"></div>
      </div>
      <div className="h-36 bg-surface-container-lowest rounded-2xl border border-surface-container-high/50 p-4"></div>
    </div>
  );
}

export function FarmSkeleton() {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-margin space-y-space-md animate-pulse">
      <div className="h-7 w-44 bg-surface-container-high/70 rounded-lg"></div>
      <div className="h-48 bg-surface-container-lowest rounded-2xl border border-surface-container-high/50 p-5 space-y-3">
        <div className="h-5 w-32 bg-surface-container-high/80 rounded"></div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="h-10 bg-surface-container-low rounded-xl"></div>
          <div className="h-10 bg-surface-container-low rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

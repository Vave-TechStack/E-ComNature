import { Leaf } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Shimmer Header */}
      <div className="border-b border-gray-100">
        <div className="container-custom py-8">
          <div className="h-4 w-24 bg-gray-200 rounded-full animate-shimmer" />
          <div className="mt-3 h-8 w-64 bg-gray-200 rounded-xl animate-shimmer" />
          <div className="mt-2 h-4 w-96 bg-gray-200 rounded-full animate-shimmer" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container-custom py-8">
        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square rounded-2xl bg-gray-100 animate-shimmer" />
              <div className="h-4 w-3/4 bg-gray-100 rounded-full animate-shimmer" />
              <div className="h-4 w-1/2 bg-gray-100 rounded-full animate-shimmer" />
              <div className="h-4 w-1/3 bg-gray-100 rounded-full animate-shimmer" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer shimmer */}
      <div className="border-t border-gray-100">
        <div className="container-custom py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-5 w-24 bg-gray-100 rounded-full animate-shimmer" />
                <div className="h-3 w-full bg-gray-100 rounded-full animate-shimmer" />
                <div className="h-3 w-3/4 bg-gray-100 rounded-full animate-shimmer" />
                <div className="h-3 w-1/2 bg-gray-100 rounded-full animate-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import dynamic from 'next/dynamic';

function LoginFallback() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="h-10 w-48 bg-noble-100 rounded-xl animate-pulse mx-auto" />
        <div className="h-4 w-64 bg-noble-100 rounded animate-pulse mx-auto" />
        <div className="h-12 bg-noble-100 rounded-xl animate-pulse" />
        <div className="h-12 bg-noble-100 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export default dynamic(() => import('./LoginForm'), {
  ssr: false,
  loading: LoginFallback,
});

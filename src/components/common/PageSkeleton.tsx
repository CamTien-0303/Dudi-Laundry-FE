export default function PageSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-6 animate-pulse w-full ${className}`}>
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-7 w-48 bg-border rounded-md" />
        <div className="h-4 w-72 bg-border/60 rounded-md" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-border/40 rounded-xl p-5 border border-border/40" />
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="border border-border/40 rounded-xl p-5 bg-border/20 h-64" />
    </div>
  );
}

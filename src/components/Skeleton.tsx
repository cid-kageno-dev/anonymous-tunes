export const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="aspect-square rounded-xl bg-muted mb-3" />
    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
    <div className="h-3 bg-muted rounded w-1/2" />
  </div>
);

export const SkeletonGrid = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

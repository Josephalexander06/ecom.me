const SkeletonCard = () => {
  return (
    <div className="bg-white border border-border-default rounded-pro p-4 animate-pulse">
      <div className="aspect-square bg-surface-secondary rounded-pro mb-4" />
      <div className="h-4 bg-surface-secondary rounded w-3/4 mb-2" />
      <div className="h-4 bg-surface-secondary rounded w-1/2 mb-4" />
      <div className="flex justify-between items-center">
        <div className="h-6 bg-surface-secondary rounded w-1/3" />
        <div className="h-10 bg-brand-primary/10 rounded-pill w-1/3" />
      </div>
    </div>
  );
};

export default SkeletonCard;

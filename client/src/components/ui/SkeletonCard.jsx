import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="neo-panel rounded-2xl p-3">
      <div className="skeleton h-32 w-full rounded-xl" />
      <div className="skeleton h-4 w-5/6 rounded mt-3" />
      <div className="skeleton h-4 w-2/3 rounded mt-2" />
      <div className="skeleton h-4 w-1/3 rounded mt-4" />
      <div className="skeleton h-8 w-full rounded-lg mt-3" />
    </div>
  );
};

export default SkeletonCard;

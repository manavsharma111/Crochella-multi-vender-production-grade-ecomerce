import React from 'react';

const Skeleton = ({ className, count = 1 }) => {
  const renderSkeletons = () => {
    return Array.from({ length: count }).map((_, index) => (
      <div 
        key={index} 
        className={`bg-gray-800/50 animate-pulse rounded-lg ${className}`}
      ></div>
    ));
  };

  return <>{renderSkeletons()}</>;
};

export const CardSkeleton = () => (
  <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 w-full h-80 flex flex-col gap-4 animate-pulse">
    <div className="w-full h-40 bg-gray-800/50 rounded-xl"></div>
    <div className="w-3/4 h-6 bg-gray-800/50 rounded-md"></div>
    <div className="w-1/2 h-4 bg-gray-800/50 rounded-md"></div>
    <div className="mt-auto w-full h-10 bg-gray-800/50 rounded-xl"></div>
  </div>
);

export const TextSkeleton = ({ lines = 3 }) => (
  <div className="flex flex-col gap-2">
    <Skeleton className="h-4 w-full" count={lines - 1} />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

export default Skeleton;

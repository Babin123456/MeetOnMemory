import React from "react";

const SearchSkeleton = () => {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-5 w-12 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchSkeleton;

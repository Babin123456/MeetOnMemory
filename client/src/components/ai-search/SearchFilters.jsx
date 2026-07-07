import React from "react";

const SearchFilters = ({ filters, setFilters, resultCount }) => {
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Type:</label>
          <select
            value={filters.resultType}
            onChange={(e) => handleFilterChange("resultType", e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="all">All Types</option>
            <option value="meeting">Meetings</option>
            <option value="policy">Policies</option>
            <option value="summary">AI Summaries</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">From:</label>
          <input
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">To:</label>
          <input
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="relevance">Relevance</option>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
          </select>
        </div>

        {resultCount > 0 && (
          <div className="ml-auto text-sm text-gray-500">
            {resultCount} result{resultCount !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;

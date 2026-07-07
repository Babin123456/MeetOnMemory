import React from "react";

const SearchBar = ({ query, setQuery, onSearch, loading, onClear }) => {
  return (
    <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-center gap-3 mb-5">
        <input
          type="text"
          placeholder="Ask e.g. 'What decisions were made in the finance meeting?'"
          className="flex-grow px-5 py-3 text-sm md:text-base border border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
        {query && (
          <button
            onClick={onClear}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            title="Clear search"
          >
            ✕
          </button>
        )}
        <button
          onClick={onSearch}
          disabled={loading}
          className="px-6 py-2 md:px-8 md:py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Searching...
            </span>
          ) : (
            "Search"
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

import React from "react";

const SearchEmptyState = ({ hasSearched }) => {
  if (hasSearched) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No results found
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          We couldn't find any matches for your search. Try different keywords
          or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">💬</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Start searching
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Type your question above to explore your meetings, policies, and AI
        summaries using natural language.
      </p>
    </div>
  );
};

export default SearchEmptyState;

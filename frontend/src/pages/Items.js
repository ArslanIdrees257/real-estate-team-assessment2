import React, { useEffect, useState, useCallback } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'; 

const ITEMS_PER_PAGE = 10;

function Items() {
  const { items, loading, totalCount, fetchItems } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const itemData = React.useMemo(() => ({ items }), [items]);

  const loadItems = useCallback(() => {
    let active = true;

    const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        q: searchQuery,
    };
    
    fetchItems(params).catch(e => {
        if (active) console.error("Error fetching items:", e);
    });

    return () => {
      active = false;
    };
  }, [fetchItems, currentPage, searchQuery]);

  useEffect(() => {
    const cleanup = loadItems();
    return cleanup;
  }, [loadItems]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
    }
  };
  
  const showLoadingOverlay = loading && items.length > 0;
  
  if (loading && !items.length) {
    return <p className="p-4 text-center text-gray-500">Loading initial items...</p>;
  }
  
  if (!items.length && !loading) {
      return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg mt-6 text-center">
            <h1 className="text-xl font-semibold text-gray-700">No results found</h1>
            <p className="text-gray-500 mt-1">Try refining your search for: "{searchQuery}"</p>
        </div>
      );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Product Catalog</h1>
      {/* Search Bar */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search items by name or category..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-3 pl-10 border border-gray-300 rounded-xl w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
      {/* List of items */}
      <div className="border border-gray-200 rounded-xl shadow-2xl overflow-hidden bg-white relative">
       <div className="overflow-x-auto shadow-xl rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        
        <thead className="bg-gray-50">
          <tr>
            {['id','name','category',"price"].map(column => (
              <th
                key={column}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-gray-100">
          {itemData.items.map((item) => (
            <tr 
              key={item.id || JSON.stringify(item)} 
              className="hover:bg-indigo-50 transition duration-150"
            >
              {['id','name','category',"price"].map(column => (
                <td 
                  key={column} 
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                >
                  {item[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        {showLoadingOverlay && (
             <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center transition-opacity duration-300">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
             </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalCount > ITEMS_PER_PAGE && (
        <div className="flex justify-center items-center mt-8 space-x-4">
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="flex items-center px-4 py-2 border border-indigo-300 text-sm font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
            >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </button>
            <span className="text-gray-700 font-bold px-3 py-1 bg-gray-200 rounded-lg">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="flex items-center px-4 py-2 border border-indigo-300 text-sm font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
            >
                Next <ChevronRight className="w-4 h-4 ml-1" />
            </button>
        </div>
      )}
    </div>
  );
}

export default Items;
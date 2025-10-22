import React, { createContext, useContext, useState, useCallback } from 'react';

const DataContext = createContext({});

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchItems = useCallback(async (params = {}) => {
    setLoading(true);
    
    const url = new URL(`http://localhost:4001/api/items`);
    
    if (params.page) url.searchParams.append('_page', params.page);
    if (params.limit) url.searchParams.append('_limit', params.limit);
    if (params.q) url.searchParams.append('q', params.q);
  http://localhost:4001/api/items?_page=1_&limit=2&q=
    try {
      const res = await fetch(url.toString());
      
      if (!res.ok) {
        throw new Error(`Failed to fetch items with status: ${res.status}`);
      }

      const total = res.headers.get('X-Total-Count');
      if (total !== null) {
        setTotalCount(parseInt(total, 10));
      } else {
        setTotalCount(0);
      }
      
      const data = await res.json();
      setItems(data);

    } catch (e) {
      console.error("DataContext fetch error:", e);
      throw e; 
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    items,
    loading,
    totalCount,
    fetchItems,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

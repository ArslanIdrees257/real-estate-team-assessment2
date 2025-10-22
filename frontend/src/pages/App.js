import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';
import '../index.css';

function App() {
  return (
      <DataProvider>
        <nav className="shadow-md bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                  <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition">
                      Product Browser
                  </Link>
              </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50 pt-4">
          <Routes>
            <Route path="/" element={<Items />} />
            <Route path="/items/:id" element={<ItemDetail />} />
          </Routes>
        </main>
      </DataProvider>
  );
}

export default App;

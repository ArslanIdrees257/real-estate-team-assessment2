import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Tag, DollarSign, List } from 'lucide-react'; 

const SkeletonItem = ({ height, className = "" }) => (
    <div className={`bg-gray-200 animate-pulse rounded-md ${height} ${className}`}></div>
);

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    
    setLoading(true);
    
    fetch('/api/items/' + id)
      .then(res => {
        if (!res.ok) {
            throw new Error(res.status === 404 ? 'Item not found' : 'Failed to fetch item');
        }
        return res.json();
      })
      .then(data => {
        if (active) {
            setItem(data);
        }
      })
      .catch((e) => {
        console.error("ItemDetail fetch error:", e);
        if (active) {
            navigate('/', { replace: true });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
      
    return () => {
        active = false;
    };
  }, [id, navigate]);


  if (loading) return (
      <div className="p-8 max-w-xl mx-auto mt-6 bg-white shadow-2xl rounded-xl border border-indigo-100">
        <SkeletonItem height="h-10 w-3/4" className="mb-6" />
        <div className="mt-4 space-y-5">
            <SkeletonItem height="h-6 w-1/2" />
            <SkeletonItem height="h-8 w-1/3" />
            <SkeletonItem height="h-40 w-full mt-4" />
        </div>
        <SkeletonItem height="h-12 w-48" className="mt-8" />
      </div>
  );
  
  if (!item) return null;

  const price = typeof item.price === 'number' ? item.price : 0;
  const description = item.description || 'No detailed description available.';

  return (
    <div className="p-8 max-w-2xl mx-auto mt-6 bg-white shadow-2xl rounded-xl border border-indigo-100">
      <h2 className="text-4xl font-extrabold text-indigo-700 mb-6 border-b pb-3">{item.name}</h2>
      
      <div className="space-y-6 text-lg text-gray-700">
        
        {/* Category */}
        <div className="flex items-center">
            <Tag className="w-5 h-5 text-gray-500 mr-3" />
            <strong className="font-semibold text-gray-800">Category:</strong> 
            <span className="ml-3 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium shadow-sm uppercase tracking-wider">
                {item.category || 'N/A'}
            </span>
        </div>

        {/* Price */}
        <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-green-600 mr-3" />
            <strong className="font-semibold text-gray-800">Price:</strong> 
            <span className="ml-3 font-mono text-3xl font-bold text-green-600">${price.toFixed(2)}</span>
        </div>
        
        {/* Description */}
        <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center mb-2">
                <List className="w-5 h-5 text-gray-500 mr-3" />
                <strong className="font-semibold text-gray-800 block">Description:</strong>
            </div>
            <p className="text-gray-600 italic leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                {description}
            </p>
        </div>
      </div>
      
       <button
            onClick={() => navigate('/', { replace: true })}
            className="mt-10 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 transform hover:scale-[1.01]"
        >
            <ChevronLeft className="w-5 h-5 mr-2" /> Back to Catalog
        </button>
    </div>
  );
}

export default ItemDetail;

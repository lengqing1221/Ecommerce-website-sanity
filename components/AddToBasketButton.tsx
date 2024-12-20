'use client'
import useBasketStore from '@/app/(store)/store';
import { Product } from '@/sanity.types'
import React, { useState, useEffect } from 'react'

interface AddToBasketProps {
  product: Product
  disabled?: boolean
}

const AddToBasketButton = ({ product, disabled }: AddToBasketProps) => {
  const { addItem, removeItem, getItemCount } = useBasketStore();
  
  // Get item count from the store based on the product ID
  const itemCount = getItemCount(product); 
  
  const [isClient, setIsClient] = useState(false);

  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2 w-auto">
     <button
  onClick={() => removeItem(product)}  
  disabled={itemCount === 0 || disabled}
  className={`w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-700 text-white font-bold flex items-center justify-center transition-colors duration-200 ${itemCount === 0 || disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
>
  <span className="text-xl font-bold">-</span>
</button>


      <span className="w-8 text-center font-semibold">{itemCount}</span>

      <button
        onClick={() => addItem(product, 1)}
        disabled={disabled}
        className={`w-8 h-8 rounded-full text-white font-bold flex items-center justify-center transition-colors duration-200 ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        <span className="text-xl font-bold">+</span>
      </button>
    </div>
  );
};

export default AddToBasketButton;

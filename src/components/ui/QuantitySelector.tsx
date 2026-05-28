import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: { button: 'w-7 h-7', icon: 'w-3 h-3', text: 'text-sm w-8' },
    md: { button: 'w-9 h-9', icon: 'w-4 h-4', text: 'text-base w-10' },
  };

  const handleDecrement = () => {
    if (quantity > min) onChange(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDecrement}
        disabled={quantity <= min}
        className={cn(
          'flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700',
          'hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors',
          sizes[size].button
        )}
      >
        <Minus className={sizes[size].icon} />
      </motion.button>
      <span className={cn('text-center font-medium text-gray-900 dark:text-gray-100', sizes[size].text)}>
        {quantity}
      </span>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleIncrement}
        disabled={quantity >= max}
        className={cn(
          'flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700',
          'hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors',
          sizes[size].button
        )}
      >
        <Plus className={sizes[size].icon} />
      </motion.button>
    </div>
  );
};

export default QuantitySelector;

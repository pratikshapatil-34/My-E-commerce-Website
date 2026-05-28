import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviews?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  size = 'md',
  showValue = true,
  reviews,
  interactive = false,
  onChange,
  className,
}) => {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const displayValue = hoverValue ?? value;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className={cn('flex', interactive && 'cursor-pointer')}>
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(displayValue);
          const partial = i === Math.floor(displayValue) && displayValue % 1 > 0;

          return (
            <div
              key={i}
              className="relative"
              onMouseEnter={() => interactive && setHoverValue(i + 1)}
              onMouseLeave={() => interactive && setHoverValue(null)}
              onClick={() => interactive && onChange?.(i + 1)}
            >
              <Star
                className={cn(
                  sizes[size],
                  'transition-colors',
                  filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'
                )}
              />
              {partial && (
                <div className="absolute inset-0 overflow-hidden" style={{ width: `${(displayValue % 1) * 100}%` }}>
                  <Star className={cn(sizes[size], 'text-yellow-400 fill-yellow-400')} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
          {value.toFixed(1)}
        </span>
      )}
      {reviews !== undefined && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ({reviews.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default Rating;

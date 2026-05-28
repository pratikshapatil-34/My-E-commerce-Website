import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center text-center py-12 px-4', className)}
    >
      <div className="text-gray-400 dark:text-gray-500 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      {description && <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">{description}</p>}
      {action && <div>{action}</div>}
    </motion.div>
  );
};

export default EmptyState;

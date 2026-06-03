import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
    </div>
  );
};

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Input({ className, icon: Icon, error, ...props }) {
  return (
    <div className="w-full">
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        <input
          className={cn(
            'w-full rounded-lg border bg-white px-4 py-2 text-gray-900 transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
            Icon ? 'pl-10' : '',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

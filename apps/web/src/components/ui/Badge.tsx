import clsx from 'clsx';

export function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    gray: 'bg-gray-100 text-gray-700',
  };
  return (
    <span className={clsx('px-2 py-1 rounded text-xs font-medium', colors[color])}>
      {children}
    </span>
  );
}
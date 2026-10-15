'use client';
import Image from 'next/image';

interface Props {
  size?: number;
  showText?: boolean;
  textColor?: string;
  className?: string;
}

export function INULogo({
  size = 44,
  showText = true,
  textColor = 'text-gray-800',
  className = '',
}: Props) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative flex-shrink-0 rounded-full overflow-hidden bg-white shadow-sm border border-gray-100"
        style={{ width: size, height: size }}
      >
        <Image
          src="/icons/logo.jpg"
          alt="Injibara University"
          width={size}
          height={size}
          className="object-cover"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold ${textColor}`}>
            Injibara University
          </span>
          <span className="text-xs text-gray-500">
            Student Portal
          </span>
        </div>
      )}
    </div>
  );
}
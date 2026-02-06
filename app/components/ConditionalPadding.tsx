'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalPadding({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // No padding on homepage and /orario routes
  const noPadding = pathname === '/' || pathname?.startsWith('/orario');

  return (
    <div className={noPadding ? 'relative' : 'pt-16 relative'}>
      {children}
    </div>
  );
}

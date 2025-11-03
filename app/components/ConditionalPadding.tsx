'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalPadding({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // No padding on /orario routes
  const isOrarioRoute = pathname?.startsWith('/orario');

  return (
    <div className={isOrarioRoute ? 'relative' : 'pt-16 relative'}>
      {children}
    </div>
  );
}

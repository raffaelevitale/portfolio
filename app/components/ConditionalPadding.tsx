'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalPadding({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const noPadding = pathname?.startsWith('/orario');

  return (
    <div className={noPadding ? 'relative' : 'relative'}>
      {children}
    </div>
  );
}

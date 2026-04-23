'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalPadding({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSubApp = pathname?.startsWith('/orario');

  return (
    <div className={isSubApp ? 'relative' : 'relative pt-[72px]'}>
      {children}
    </div>
  );
}

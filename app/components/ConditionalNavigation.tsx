'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();

  if (pathname?.startsWith('/orario') || pathname?.startsWith('/interfaccia')) {
    return null;
  }

  return <Navigation />;
}

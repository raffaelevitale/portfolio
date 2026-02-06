'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();

  // Hide navigation on homepage and /orario routes
  if (pathname === '/' || pathname?.startsWith('/orario')) {
    return null;
  }

  return <Navigation />;
}

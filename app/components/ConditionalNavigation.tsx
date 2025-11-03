'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();

  // Hide navigation on /orario and its sub-routes
  if (pathname?.startsWith('/orario')) {
    return null;
  }

  return <Navigation />;
}

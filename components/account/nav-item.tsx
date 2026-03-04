'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface NavItemProps {
  href: string;
  label: string;
}

export function AccountNavItem({ href, label }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button variant={isActive ? 'secondary' : 'ghost'} className="justify-start w-full" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
}

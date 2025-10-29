'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DollarSign, LayoutDashboard, Receipt, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: Receipt,
  },
  {
    title: 'Budgets',
    href: '/budgets',
    icon: Target,
  },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <DollarSign className="h-6 w-6 text-primary" />
            <span>ExpenseFlow</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}


import { Suspense } from 'react';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { CategoryChart } from '@/components/dashboard/category-chart';
import { TrendChart } from '@/components/dashboard/trend-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/db';

async function getDemoUser() {
  // Get the demo user (or first user)
  const user = await db.user.findFirst({
    where: {
      email: 'demo@expenseflow.com',
    },
  });

  return user;
}

async function getDashboardStats(userId: string) {
  // Fetch from our analytics API
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(
    `${baseUrl}/api/analytics/stats?userId=${userId}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    const error = await res.text();
    console.error('Failed to fetch dashboard stats:', error);
    throw new Error('Failed to fetch dashboard stats');
  }

  return res.json();
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[350px]" />
        <Skeleton className="h-[350px]" />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Your financial overview and insights
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const user = await getDemoUser();

  if (!user) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center text-muted-foreground">
            <p>No user found. Please run the database seed:</p>
            <code className="mt-2 block text-sm">npx prisma db seed</code>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = await getDashboardStats(user.id);

  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h2 className="text-xl font-semibold">{user.name}</h2>
        </div>
      </div>

      {/* Summary Stats */}
      <StatsCards data={stats.summary} />

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <CategoryChart data={stats.categoryBreakdown.expenses} title="Expense Breakdown" />
        <TrendChart data={stats.monthlyTrend} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={stats.recentTransactions} />
    </div>
  );
}


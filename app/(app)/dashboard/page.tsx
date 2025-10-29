import { Suspense } from 'react';
import { headers } from 'next/headers';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { CategoryChart } from '@/components/dashboard/category-chart';
import { TrendChart } from '@/components/dashboard/trend-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/db';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

// PPR is automatically enabled via cacheComponents + Suspense in Next.js 16!

async function getDemoUser() {
  'use cache';
  
  // Get the demo user (or first user)
  const user = await db.user.findFirst({
    where: {
      email: 'demo@expenseflow.com',
    },
  });

  return user;
}

async function getDashboardStats(userId: string) {
  // Access headers to make this route dynamic (required for new Date() in Next.js 16)
  await headers();
  
  // Use current month
  const targetDate = new Date();
  const monthStart = startOfMonth(targetDate);
  const monthEnd = endOfMonth(targetDate);
  
  // Get 6 months of data for trends
  const sixMonthsAgo = subMonths(monthStart, 5);

  // Summary stats for current month
  const [income, expenses] = await Promise.all([
    db.transaction.aggregate({
      where: { userId, type: 'INCOME', date: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: { userId, type: 'EXPENSE', date: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = income._sum.amount || 0;
  const totalExpenses = expenses._sum.amount || 0;

  // Category breakdown for expenses
  const expensesByCategory = await db.transaction.groupBy({
    by: ['categoryId'],
    where: { userId, type: 'EXPENSE', date: { gte: monthStart, lte: monthEnd } },
    _sum: { amount: true },
  });

  const categories = await db.category.findMany({
    where: { id: { in: expensesByCategory.map((e: { categoryId: string }) => e.categoryId) } },
  });

  const categoryBreakdown = expensesByCategory.map((item: { categoryId: string; _sum: { amount: number | null } }) => {
    const category = categories.find((c: { id: string }) => c.id === item.categoryId);
    return {
      categoryId: item.categoryId,
      categoryName: category?.name || 'Unknown',
      icon: category?.icon,
      color: category?.color,
      amount: item._sum.amount || 0,
      percentage: ((item._sum.amount || 0) / totalExpenses) * 100,
    };
  });

  // Monthly trends (last 6 months)
  const monthlyTransactions = await db.transaction.findMany({
    where: { userId, date: { gte: sixMonthsAgo, lte: monthEnd } },
    select: {
      date: true,
      amount: true,
      type: true,
    },
  });

  // Group by month
  const monthlyMap = new Map<string, { income: number; expenses: number }>();
  
  monthlyTransactions.forEach((transaction: { date: Date; amount: number; type: string }) => {
    const monthKey = format(startOfMonth(transaction.date), 'MMM yyyy');
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { income: 0, expenses: 0 });
    }
    const data = monthlyMap.get(monthKey)!;
    if (transaction.type === 'INCOME') {
      data.income += transaction.amount;
    } else {
      data.expenses += transaction.amount;
    }
  });

  // Convert to array for chart
  const monthlyTrend = Array.from(monthlyMap.entries()).map(([month, data]) => ({
    month,
    income: data.income,
    expenses: data.expenses,
    net: data.income - data.expenses,
  }));

  // Recent transactions
  const recentTransactions = await db.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: 'desc' },
    take: 10,
  });

  return {
    summary: {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      incomeChange: 0, // Simplified for now
      expenseChange: 0,
    },
    categoryBreakdown: { expenses: categoryBreakdown },
    monthlyTrend,
    recentTransactions,
  };
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

  // Using cached database query for better performance
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


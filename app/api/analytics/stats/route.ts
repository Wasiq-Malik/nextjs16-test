import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

// GET /api/analytics/stats - Get dashboard statistics
// Note: This route is automatically dynamic due to searchParams usage
export async function GET(request: NextRequest) {
  try {
    // Use nextUrl.searchParams in Next.js 15+ for better performance and prerendering
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const monthParam = searchParams.get('month'); // Optional: YYYY-MM-DD

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Use current month if not specified
    const targetDate = monthParam ? new Date(monthParam) : new Date();
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);

    // Previous month for comparison
    const prevMonthStart = startOfMonth(subMonths(targetDate, 1));
    const prevMonthEnd = endOfMonth(subMonths(targetDate, 1));

    // --- Current Month Stats ---
    const [currentIncome, currentExpenses] = await Promise.all([
      db.transaction.aggregate({
        where: {
          userId,
          type: 'INCOME',
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      }),
      db.transaction.aggregate({
        where: {
          userId,
          type: 'EXPENSE',
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = currentIncome._sum.amount || 0;
    const totalExpenses = currentExpenses._sum.amount || 0;
    const netBalance = totalIncome - totalExpenses;

    // --- Previous Month Stats (for comparison) ---
    const [prevIncome, prevExpenses] = await Promise.all([
      db.transaction.aggregate({
        where: {
          userId,
          type: 'INCOME',
          date: { gte: prevMonthStart, lte: prevMonthEnd },
        },
        _sum: { amount: true },
      }),
      db.transaction.aggregate({
        where: {
          userId,
          type: 'EXPENSE',
          date: { gte: prevMonthStart, lte: prevMonthEnd },
        },
        _sum: { amount: true },
      }),
    ]);

    const prevTotalIncome = prevIncome._sum.amount || 0;
    const prevTotalExpenses = prevExpenses._sum.amount || 0;

    // Calculate percentage changes
    const incomeChange = prevTotalIncome
      ? ((totalIncome - prevTotalIncome) / prevTotalIncome) * 100
      : 0;
    const expenseChange = prevTotalExpenses
      ? ((totalExpenses - prevTotalExpenses) / prevTotalExpenses) * 100
      : 0;

    // --- Category Breakdown ---
    const categoryBreakdown = await db.transaction.groupBy({
      by: ['categoryId', 'type'],
      where: {
        userId,
        date: { gte: monthStart, lte: monthEnd },
      },
      _sum: {
        amount: true,
      },
    });

    // Get category details
    type CategoryBreakdownItem = {
      categoryId: string;
      type: string;
      _sum: { amount: number | null };
    };

    const categoryIds = categoryBreakdown.map((item: CategoryBreakdownItem) => item.categoryId);
    const categories = await db.category.findMany({
      where: { id: { in: categoryIds } },
    });

    type CategoryType = {
      id: string;
      name: string;
      icon: string | null;
      color: string | null;
    };

    const categoryMap = new Map<string, CategoryType>(categories.map((cat: CategoryType) => [cat.id, cat]));

    const defaultCategory: CategoryType = { id: '', name: 'Unknown', icon: null, color: null };

    const expensesByCategory = categoryBreakdown
      .filter((item: CategoryBreakdownItem) => item.type === 'EXPENSE')
      .map((item: CategoryBreakdownItem) => {
        const category: CategoryType = categoryMap.get(item.categoryId) ?? defaultCategory;
        return {
          categoryId: item.categoryId,
          categoryName: category.name || 'Unknown',
          icon: category.icon || null,
          color: category.color || null,
          amount: item._sum.amount || 0,
          percentage: totalExpenses
            ? ((item._sum.amount || 0) / totalExpenses) * 100
            : 0,
        };
      })
      .sort((a: { amount: number }, b: { amount: number }) => b.amount - a.amount);

    const incomeByCategory = categoryBreakdown
      .filter((item: CategoryBreakdownItem) => item.type === 'INCOME')
      .map((item: CategoryBreakdownItem) => {
        const category: CategoryType = categoryMap.get(item.categoryId) ?? defaultCategory;
        return {
          categoryId: item.categoryId,
          categoryName: category.name || 'Unknown',
          icon: category.icon || null,
          color: category.color || null,
          amount: item._sum.amount || 0,
          percentage: totalIncome
            ? ((item._sum.amount || 0) / totalIncome) * 100
            : 0,
        };
      })
      .sort((a: { amount: number }, b: { amount: number }) => b.amount - a.amount);

    // --- Recent Transactions ---
    const recentTransactions = await db.transaction.findMany({
      where: {
        userId,
        date: { gte: monthStart, lte: monthEnd },
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: 10,
    });

    // --- Monthly Trend (last 6 months) ---
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const trendDate = subMonths(targetDate, i);
      const trendStart = startOfMonth(trendDate);
      const trendEnd = endOfMonth(trendDate);

      const [income, expenses] = await Promise.all([
        db.transaction.aggregate({
          where: {
            userId,
            type: 'INCOME',
            date: { gte: trendStart, lte: trendEnd },
          },
          _sum: { amount: true },
        }),
        db.transaction.aggregate({
          where: {
            userId,
            type: 'EXPENSE',
            date: { gte: trendStart, lte: trendEnd },
          },
          _sum: { amount: true },
        }),
      ]);

      monthlyTrend.push({
        month: format(trendDate, 'MMM yyyy'),
        income: income._sum.amount || 0,
        expenses: expenses._sum.amount || 0,
        net: (income._sum.amount || 0) - (expenses._sum.amount || 0),
      });
    }

    return NextResponse.json({
      summary: {
        totalIncome,
        totalExpenses,
        netBalance,
        incomeChange: Math.round(incomeChange * 10) / 10,
        expenseChange: Math.round(expenseChange * 10) / 10,
      },
      categoryBreakdown: {
        expenses: expensesByCategory,
        income: incomeByCategory,
      },
      recentTransactions,
      monthlyTrend,
      period: {
        start: monthStart,
        end: monthEnd,
        label: format(monthStart, 'MMMM yyyy'),
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}


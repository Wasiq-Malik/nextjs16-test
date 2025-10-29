/**
 * Cached database queries using Next.js 16 "use cache" directive
 * These functions will have their results cached for improved performance
 */

import { db } from '@/lib/db';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

/**
 * Get dashboard analytics with automatic caching
 * This expensive query is cached to improve dashboard load times
 */
export async function getCachedDashboardStats(userId: string) {
  'use cache';
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(
    `${baseUrl}/api/analytics/stats?userId=${userId}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }

  return res.json();
}

/**
 * Get user's recent transactions with caching
 */
export async function getCachedRecentTransactions(userId: string, limit = 10) {
  'use cache';
  
  const transactions = await db.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: 'desc' },
    take: limit,
  });

  return transactions;
}

/**
 * Get monthly spending by category with caching
 */
export async function getCachedMonthlySpending(userId: string, monthsBack = 6) {
  'use cache';
  
  const startDate = startOfMonth(subMonths(new Date(), monthsBack));
  
  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: { gte: startDate },
      type: 'EXPENSE',
    },
    include: { category: true },
  });

  // Group by month and category
  const monthlyData = new Map<string, Map<string, number>>();
  
  transactions.forEach((t: { date: Date; type: string; amount: number; category: { name: string } }) => {
    const monthKey = startOfMonth(t.date).toISOString();
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, new Map());
    }
    const categoryMap = monthlyData.get(monthKey)!;
    const current = categoryMap.get(t.category.name) || 0;
    categoryMap.set(t.category.name, current + t.amount);
  });

  return Array.from(monthlyData.entries()).map(([month, categories]) => ({
    month,
    categories: Object.fromEntries(categories.entries()),
  }));
}

/**
 * Get user's budget status with caching
 */
export async function getCachedBudgetStatus(userId: string) {
  'use cache';
  
  const currentMonth = startOfMonth(new Date());
  const nextMonth = endOfMonth(new Date());

  const budgets = await db.budget.findMany({
    where: {
      userId,
      month: { gte: currentMonth, lte: nextMonth },
    },
    include: { category: true },
  });

  // Calculate spending for each budget
  const budgetStatus = await Promise.all(
    budgets.map(async (budget: { categoryId: string; amount: number; month: Date; category: { name: string; icon: string | null; color: string | null } }) => {
      const spent = await db.transaction.aggregate({
        where: {
          userId,
          categoryId: budget.categoryId,
          date: { gte: currentMonth, lte: nextMonth },
          type: 'EXPENSE',
        },
        _sum: { amount: true },
      });

      return {
        ...budget,
        spent: spent._sum.amount || 0,
        remaining: budget.amount - (spent._sum.amount || 0),
        percentage: ((spent._sum.amount || 0) / budget.amount) * 100,
      };
    })
  );

  return budgetStatus;
}

/**
 * Get all categories for a user with caching
 */
export async function getCachedCategories(userId: string, type?: 'EXPENSE' | 'INCOME') {
  'use cache';
  
  const categories = await db.category.findMany({
    where: {
      OR: [
        { userId: null }, // System categories
        { userId }, // User categories
      ],
      ...(type && { type }),
    },
    orderBy: [
      { userId: 'asc' }, // System categories first
      { name: 'asc' },
    ],
  });

  return categories;
}


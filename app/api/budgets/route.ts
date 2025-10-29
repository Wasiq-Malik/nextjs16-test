import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { budgetSchema } from '@/lib/validations';
import { startOfMonth, endOfMonth } from 'date-fns';

// GET /api/budgets - Get all budgets for a user (optionally filtered by month)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const month = searchParams.get('month'); // Format: YYYY-MM-DD (first day of month)

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const budgets = await db.budget.findMany({
      where: {
        userId,
        ...(month && { month: new Date(month) }),
      },
      include: {
        category: true,
      },
      orderBy: {
        month: 'desc',
      },
    });

    // For each budget, calculate actual spending
    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const monthStart = startOfMonth(budget.month);
        const monthEnd = endOfMonth(budget.month);

        const transactions = await db.transaction.aggregate({
          where: {
            userId,
            categoryId: budget.categoryId,
            type: 'EXPENSE',
            date: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
          _sum: {
            amount: true,
          },
        });

        const spent = transactions._sum.amount || 0;
        const remaining = budget.amount - spent;
        const percentageUsed = (spent / budget.amount) * 100;

        return {
          ...budget,
          spent,
          remaining,
          percentageUsed: Math.min(percentageUsed, 100), // Cap at 100%
          isExceeded: spent > budget.amount,
        };
      })
    );

    return NextResponse.json(budgetsWithSpending);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

// POST /api/budgets - Create a new budget
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = budgetSchema.parse(body);

    // Normalize month to first day of the month
    const monthDate = startOfMonth(validatedData.month);

    const budget = await db.budget.create({
      data: {
        ...validatedData,
        month: monthDate,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error },
        { status: 400 }
      );
    }

    // Handle unique constraint violation
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Budget already exists for this category and month' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    );
  }
}


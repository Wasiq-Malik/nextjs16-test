import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categorySchema } from '@/lib/validations';

// GET /api/categories - Get all categories (system + user categories)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    // Get system categories (userId is null) and user's custom categories
    const categories = await db.category.findMany({
      where: {
        OR: [
          { userId: null }, // System categories
          ...(userId ? [{ userId }] : []), // User's custom categories
        ],
        ...(type && type !== 'ALL' && { type: type as 'INCOME' | 'EXPENSE' }),
      },
      orderBy: [
        { userId: 'asc' }, // System categories first (null comes before strings)
        { name: 'asc' },
      ],
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new custom category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = categorySchema.parse(body);

    const category = await db.category.create({
      data: validatedData,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}


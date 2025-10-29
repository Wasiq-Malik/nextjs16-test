import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { updateBudgetSchema } from '@/lib/validations';
import { startOfMonth } from 'date-fns';

// PUT /api/budgets/[id] - Update a budget
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = updateBudgetSchema.parse(body);

    // If month is being updated, normalize to first day
    const updateData = {
      ...validatedData,
      ...(validatedData.month && { month: startOfMonth(validatedData.month) }),
    };

    const budget = await db.budget.update({
      where: { id: params.id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error updating budget:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update budget' },
      { status: 500 }
    );
  }
}

// DELETE /api/budgets/[id] - Delete a budget
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.budget.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Budget deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json(
      { error: 'Failed to delete budget' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { updateTransactionSchema } from '@/lib/validations';

// GET /api/transactions/[id] - Get a single transaction
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transaction = await db.transaction.findUnique({
      where: { id: params.id },
      include: {
        category: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

// PUT /api/transactions/[id] - Update a transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = updateTransactionSchema.parse(body);

    const transaction = await db.transaction.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        category: true,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions/[id] - Delete a transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.transaction.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Transaction deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}


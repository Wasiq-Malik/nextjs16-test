import { Suspense } from 'react';
import { db } from '@/lib/db';
import { TransactionList } from '@/components/transactions/transaction-list';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

async function getDemoUser() {
  const user = await db.user.findFirst({
    where: { email: 'demo@expenseflow.com' },
  });
  return user;
}

async function getTransactions(userId: string) {
  const transactions = await db.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: 'desc' },
    take: 50, // Limit to last 50 transactions
  });
  return transactions;
}

async function getCategories(userId: string) {
  const categories = await db.category.findMany({
    where: {
      OR: [
        { userId: null }, // System categories
        { userId }, // User's custom categories
      ],
    },
    orderBy: [
      { userId: 'asc' }, // System first
      { name: 'asc' },
    ],
  });
  return categories;
}

function TransactionsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}

export default async function TransactionsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          Manage your income and expenses
        </p>
      </div>

      <Suspense fallback={<TransactionsSkeleton />}>
        <TransactionsContent />
      </Suspense>
    </div>
  );
}

async function TransactionsContent() {
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

  const [transactions, categories] = await Promise.all([
    getTransactions(user.id),
    getCategories(user.id),
  ]);

  return (
    <div className="space-y-6">
      {/* Add Transaction Button & Form */}
      <Card>
        <CardContent className="pt-6">
          <TransactionForm userId={user.id} categories={categories} />
        </CardContent>
      </Card>

      {/* Transactions List */}
      <TransactionList
        transactions={transactions}
        categories={categories}
        userId={user.id}
      />
    </div>
  );
}


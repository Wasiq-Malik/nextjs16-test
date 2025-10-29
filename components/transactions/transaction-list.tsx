'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TransactionForm } from './transaction-form';

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string | null;
  date: Date | string;
  category: {
    id: string;
    name: string;
    icon: string | null;
    color: string;
  };
}

interface Category {
  id: string;
  name: string;
  icon: string | null;
  type: 'INCOME' | 'EXPENSE';
}

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  userId: string;
}

export function TransactionList({ transactions, categories, userId }: TransactionListProps) {
  const router = useRouter();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center text-muted-foreground">
            <p>No transactions yet. Add your first one above!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Transactions ({transactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {transactions.map((transaction) => {
              const isIncome = transaction.type === 'INCOME';
              const date =
                typeof transaction.date === 'string'
                  ? new Date(transaction.date)
                  : transaction.date;

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  {/* Left side: Icon + Details */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                      style={{
                        backgroundColor: `${transaction.category.color}20`,
                      }}
                    >
                      {transaction.category.icon || '💰'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium truncate">
                          {transaction.category.name}
                        </p>
                        <Badge
                          variant={isIncome ? 'default' : 'secondary'}
                          className="shrink-0"
                        >
                          {transaction.type}
                        </Badge>
                      </div>
                      {transaction.description && (
                        <p className="text-sm text-muted-foreground truncate">
                          {transaction.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(date, 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>

                  {/* Right side: Amount + Actions */}
                  <div className="flex items-center gap-3 ml-4">
                    <p
                      className={`text-lg font-bold shrink-0 ${
                        isIncome ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'}$
                      {transaction.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={deletingId === transaction.id}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => setEditingTransaction(transaction)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Make changes to your transaction below.
            </DialogDescription>
          </DialogHeader>
          {editingTransaction && (
            <TransactionForm
              userId={userId}
              categories={categories}
              transaction={editingTransaction}
              onSuccess={() => setEditingTransaction(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}


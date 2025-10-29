import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

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

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            No transactions yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const isIncome = transaction.type === 'INCOME';
            const date = typeof transaction.date === 'string' 
              ? new Date(transaction.date) 
              : transaction.date;

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                {/* Left side: Icon + Details */}
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${transaction.category.color}20` }}
                  >
                    {transaction.category.icon || '💰'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{transaction.category.name}</p>
                      <Badge variant={isIncome ? 'default' : 'secondary'} className="shrink-0">
                        {isIncome ? (
                          <ArrowUpIcon className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownIcon className="h-3 w-3 mr-1" />
                        )}
                        {transaction.type}
                      </Badge>
                    </div>
                    {transaction.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {transaction.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(date, 'MMM dd, yyyy • hh:mm a')}
                    </p>
                  </div>
                </div>

                {/* Right side: Amount */}
                <div className="text-right ml-4">
                  <p
                    className={`text-lg font-bold ${
                      isIncome ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isIncome ? '+' : '-'}$
                    {transaction.amount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}


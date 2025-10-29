import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';

interface StatsCardsProps {
  data: {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    incomeChange: number;
    expenseChange: number;
  };
}

export function StatsCards({ data }: StatsCardsProps) {
  const { totalIncome, totalExpenses, netBalance, incomeChange, expenseChange } = data;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Income Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {incomeChange >= 0 ? (
              <>
                <TrendingUpIcon className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+{incomeChange.toFixed(1)}%</span>
              </>
            ) : (
              <>
                <TrendingDownIcon className="h-3 w-3 text-red-600" />
                <span className="text-red-600">{incomeChange.toFixed(1)}%</span>
              </>
            )}
            <span>from last month</span>
          </p>
        </CardContent>
      </Card>

      {/* Total Expenses Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {expenseChange >= 0 ? (
              <>
                <TrendingUpIcon className="h-3 w-3 text-red-600" />
                <span className="text-red-600">+{expenseChange.toFixed(1)}%</span>
              </>
            ) : (
              <>
                <TrendingDownIcon className="h-3 w-3 text-green-600" />
                <span className="text-green-600">{expenseChange.toFixed(1)}%</span>
              </>
            )}
            <span>from last month</span>
          </p>
        </CardContent>
      </Card>

      {/* Net Balance Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          {netBalance >= 0 ? (
            <TrendingUpIcon className="h-4 w-4 text-blue-600" />
          ) : (
            <TrendingDownIcon className="h-4 w-4 text-orange-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            ${Math.abs(netBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {netBalance >= 0 ? 'Positive' : 'Negative'} balance this month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


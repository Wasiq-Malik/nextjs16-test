import { Transaction, Category, Budget, User, TransactionType } from '@prisma/client';

// Extended types with relations
export type TransactionWithCategory = Transaction & {
  category: Category;
};

export type BudgetWithCategory = Budget & {
  category: Category;
};

export type BudgetWithSpending = BudgetWithCategory & {
  spent: number;
  remaining: number;
  percentageUsed: number;
  isExceeded: boolean;
};

// Analytics types
export interface CategoryBreakdownItem {
  categoryId: string;
  categoryName: string;
  icon?: string | null;
  color?: string;
  amount: number;
  percentage: number;
}

export interface MonthlyTrendItem {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface AnalyticsStats {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    incomeChange: number;
    expenseChange: number;
  };
  categoryBreakdown: {
    expenses: CategoryBreakdownItem[];
    income: CategoryBreakdownItem[];
  };
  recentTransactions: TransactionWithCategory[];
  monthlyTrend: MonthlyTrendItem[];
  period: {
    start: Date;
    end: Date;
    label: string;
  };
}

// Form types
export interface TransactionFormData {
  type: TransactionType;
  amount: number;
  categoryId: string;
  description?: string;
  date: Date;
}

export interface BudgetFormData {
  categoryId: string;
  amount: number;
  month: Date;
}

export interface CategoryFormData {
  name: string;
  icon?: string;
  color?: string;
  type: TransactionType;
}


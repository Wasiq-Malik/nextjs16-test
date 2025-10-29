import { z } from 'zod';

// Transaction validation schema
export const transactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.number().positive('Amount must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  date: z.coerce.date(),
  userId: z.string().min(1, 'User ID is required'),
});

export const updateTransactionSchema = transactionSchema.partial();

// Category validation schema
export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
  type: z.enum(['INCOME', 'EXPENSE']),
  userId: z.string().optional().nullable(),
});

// Budget validation schema
export const budgetSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Budget amount must be positive'),
  month: z.coerce.date(),
  userId: z.string().min(1, 'User ID is required'),
});

export const updateBudgetSchema = budgetSchema.partial().extend({
  amount: z.number().positive('Budget amount must be positive').optional(),
});

// Query parameter schemas
export const dateRangeSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  type: z.enum(['INCOME', 'EXPENSE', 'ALL']).optional(),
  categoryId: z.string().optional(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type DateRangeQuery = z.infer<typeof dateRangeSchema>;


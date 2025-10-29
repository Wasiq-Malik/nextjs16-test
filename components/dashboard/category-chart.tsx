'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryData {
  categoryId: string;
  categoryName: string;
  icon?: string | null;
  color?: string;
  amount: number;
  percentage: number;
}

interface CategoryChartProps {
  data: CategoryData[];
  title: string;
}

export function CategoryChart({ data, title }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Take top 5 categories, group rest as "Other"
  const topCategories = data.slice(0, 5);
  const otherAmount = data.slice(5).reduce((sum, cat) => sum + cat.amount, 0);
  const otherPercentage = data.slice(5).reduce((sum, cat) => sum + cat.percentage, 0);

  const chartData = [
    ...topCategories.map((cat) => ({
      name: cat.categoryName,
      value: cat.amount,
      color: cat.color || '#3b82f6',
      icon: cat.icon,
    })),
    ...(otherAmount > 0
      ? [
          {
            name: 'Other',
            value: otherAmount,
            color: '#6b7280',
            icon: '📦',
          },
        ]
      : []),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => 
                `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              }
            />
            <Legend
              formatter={(value, entry: any) => {
                const item = chartData.find((d) => d.name === value);
                return `${item?.icon || ''} ${value}`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Category List */}
        <div className="mt-4 space-y-2">
          {topCategories.map((cat) => (
            <div key={cat.categoryId} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span>{cat.icon}</span>
                <span className="font-medium">{cat.categoryName}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  ${cat.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-muted-foreground">{cat.percentage.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, PieChart, Target } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <DollarSign className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold tracking-tight">ExpenseFlow</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take control of your finances with beautiful analytics, smart budgeting, and insightful tracking.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link href="/dashboard">
                View Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="https://github.com/yourusername/expenseflow" target="_blank">
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 mb-2 text-green-600" />
              <CardTitle>Track Expenses</CardTitle>
              <CardDescription>
                Monitor your income and expenses with detailed transaction history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Categorize transactions</li>
                <li>• Add custom categories</li>
                <li>• Filter by date range</li>
                <li>• Export data</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <PieChart className="h-8 w-8 mb-2 text-blue-600" />
              <CardTitle>Visual Analytics</CardTitle>
              <CardDescription>
                Beautiful charts and graphs to understand your spending patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Category breakdowns</li>
                <li>• Monthly trends</li>
                <li>• Income vs expenses</li>
                <li>• Real-time updates</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-8 w-8 mb-2 text-purple-600" />
              <CardTitle>Budget Goals</CardTitle>
              <CardDescription>
                Set budgets per category and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Monthly budget limits</li>
                <li>• Progress indicators</li>
                <li>• Overspending alerts</li>
                <li>• Goal tracking</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Built with Modern Tech</h2>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
            <span className="px-3 py-1 bg-muted rounded-full">Next.js 14</span>
            <span className="px-3 py-1 bg-muted rounded-full">TypeScript</span>
            <span className="px-3 py-1 bg-muted rounded-full">Prisma</span>
            <span className="px-3 py-1 bg-muted rounded-full">PostgreSQL</span>
            <span className="px-3 py-1 bg-muted rounded-full">Tailwind CSS</span>
            <span className="px-3 py-1 bg-muted rounded-full">shadcn/ui</span>
            <span className="px-3 py-1 bg-muted rounded-full">Recharts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BudgetsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
        <p className="text-muted-foreground">
          Set spending limits and track your progress
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-purple-600" />
            <div>
              <CardTitle>Budget Management Coming Soon!</CardTitle>
              <CardDescription>
                This feature is under development
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Budget management will allow you to:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground ml-6">
              <li>• Set monthly spending limits per category</li>
              <li>• Track actual spending vs. budget</li>
              <li>• Get alerts when approaching limits</li>
              <li>• View budget progress with visual indicators</li>
              <li>• Analyze spending patterns over time</li>
            </ul>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-3">
                For now, you can manage your transactions and view analytics:
              </p>
              <div className="flex gap-3">
                <Button asChild>
                  <Link href="/transactions">
                    View Transactions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard">
                    View Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Future Feature Preview */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create Budgets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Set monthly limits for each spending category
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Track Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              See real-time updates as you add transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Get Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Receive notifications when nearing budget limits
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a default user
  const user = await prisma.user.upsert({
    where: { email: 'demo@expenseflow.com' },
    update: {},
    create: {
      email: 'demo@expenseflow.com',
      name: 'Demo User',
    },
  });

  console.log('✅ Created user:', user.email);

  // Default expense categories
  const expenseCategories = [
    { name: 'Food & Dining', icon: '🍕', color: '#ef4444' },
    { name: 'Transportation', icon: '🚗', color: '#f59e0b' },
    { name: 'Shopping', icon: '🛍️', color: '#ec4899' },
    { name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
    { name: 'Bills & Utilities', icon: '💡', color: '#06b6d4' },
    { name: 'Healthcare', icon: '🏥', color: '#10b981' },
    { name: 'Education', icon: '📚', color: '#3b82f6' },
    { name: 'Travel', icon: '✈️', color: '#f97316' },
    { name: 'Other Expenses', icon: '📦', color: '#6b7280' },
  ];

  // Default income categories
  const incomeCategories = [
    { name: 'Salary', icon: '💰', color: '#22c55e' },
    { name: 'Freelance', icon: '💼', color: '#10b981' },
    { name: 'Investments', icon: '📈', color: '#14b8a6' },
    { name: 'Gifts', icon: '🎁', color: '#84cc16' },
    { name: 'Other Income', icon: '💵', color: '#22d3ee' },
  ];

  // Create expense categories
  for (const cat of expenseCategories) {
    // Check if category already exists
    const existing = await prisma.category.findFirst({
      where: {
        name: cat.name,
        userId: null,
        type: 'EXPENSE',
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          ...cat,
          type: 'EXPENSE',
          userId: null, // System category
        },
      });
    }
  }

  console.log(`✅ Created ${expenseCategories.length} expense categories`);

  // Create income categories
  for (const cat of incomeCategories) {
    const existing = await prisma.category.findFirst({
      where: {
        name: cat.name,
        userId: null,
        type: 'INCOME',
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          ...cat,
          type: 'INCOME',
          userId: null, // System category
        },
      });
    }
  }

  console.log(`✅ Created ${incomeCategories.length} income categories`);

  // Create some sample transactions
  const categories = await prisma.category.findMany();
  const foodCategory = categories.find((c) => c.name === 'Food & Dining');
  const salaryCategory = categories.find((c) => c.name === 'Salary');

  if (foodCategory && salaryCategory) {
    await prisma.transaction.create({
      data: {
        type: 'INCOME',
        amount: 5000,
        categoryId: salaryCategory.id,
        description: 'Monthly salary',
        date: new Date(),
        userId: user.id,
      },
    });

    await prisma.transaction.create({
      data: {
        type: 'EXPENSE',
        amount: 45.50,
        categoryId: foodCategory.id,
        description: 'Lunch at restaurant',
        date: new Date(),
        userId: user.id,
      },
    });

    console.log('✅ Created sample transactions');
  }

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });


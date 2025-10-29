# 💰 ExpenseFlow

A modern, full-stack expense tracking application built with Next.js 14, TypeScript, Prisma, and PostgreSQL. Perfect for interview preparation and portfolio demonstration.

## 🌟 Features

- **📊 Beautiful Dashboard** - Visualize your finances with interactive charts and analytics
- **💸 Transaction Management** - Track income and expenses with detailed categorization
- **🎯 Budget Tracking** - Set monthly budgets and monitor spending
- **📈 Analytics & Insights** - Monthly trends, category breakdowns, and comparative analysis
- **🎨 Modern UI** - Built with shadcn/ui components and Tailwind CSS
- **⚡ Fast Performance** - Powered by Next.js 14 with Turbopack
- **🔒 Type-Safe** - Full TypeScript implementation with Prisma ORM

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **Recharts** - Data visualization
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless backend
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Robust relational database
- **Vercel Postgres** - Serverless database (powered by Neon)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Vercel account (for database)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd vercel-test
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up the database**

Follow the instructions in [DATABASE_SETUP.md](./DATABASE_SETUP.md) to:
- Create a Vercel Postgres database
- Get your connection string
- Add it to `.env`

Create a `.env` file:
```env
DATABASE_URL="your-postgres-connection-string"
```

4. **Run database migrations**
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

5. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

## 📁 Project Structure

```
├── app/
│   ├── api/                    # API routes (backend)
│   │   ├── transactions/       # Transaction CRUD endpoints
│   │   ├── categories/         # Category management
│   │   ├── budgets/            # Budget tracking
│   │   └── analytics/          # Dashboard statistics
│   ├── dashboard/              # Dashboard page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
│
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── dashboard/              # Dashboard-specific components
│       ├── stats-cards.tsx     # Summary statistics
│       ├── category-chart.tsx  # Pie chart for expenses
│       ├── trend-chart.tsx     # Monthly trend charts
│       └── recent-transactions.tsx
│
├── lib/
│   ├── db.ts                   # Prisma client singleton
│   ├── validations.ts          # Zod schemas
│   ├── types.ts                # TypeScript types
│   └── utils.ts                # Utility functions
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed data script
│
└── public/                     # Static assets
```

## 🎯 Key Features Explained

### Dashboard Analytics
The dashboard provides comprehensive financial insights:
- **Summary Cards**: Total income, expenses, and net balance with month-over-month changes
- **Expense Breakdown**: Pie chart showing spending by category
- **Monthly Trends**: 6-month historical view of income vs expenses
- **Recent Transactions**: Latest 10 transactions with quick view

### Transaction Management
- Create, read, update, and delete transactions
- Categorize as income or expense
- Add descriptions and dates
- Filter by date range, category, and type

### Budget Tracking
- Set monthly budget limits per category
- Track actual spending vs budget
- Visual progress indicators
- Overspending alerts

### Category System
- 14 pre-seeded categories (9 expense + 5 income)
- Custom category creation
- Emoji icons for visual identification
- Color-coded for better UX

## 🗄️ Database Schema

```prisma
model User {
  id           String        @id @default(cuid())
  email        String        @unique
  name         String
  transactions Transaction[]
  budgets      Budget[]
  categories   Category[]
}

model Transaction {
  id          String          @id @default(cuid())
  type        TransactionType // INCOME | EXPENSE
  amount      Float
  category    Category
  description String?
  date        DateTime
  user        User
}

model Category {
  id     String          @id @default(cuid())
  name   String
  icon   String?
  color  String
  type   TransactionType
  userId String?         // null = system category
}

model Budget {
  id       String   @id @default(cuid())
  category Category
  amount   Float
  month    DateTime
  user     User
}
```

## 📚 API Endpoints

Full API documentation available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick Reference

- `GET  /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `GET  /api/categories` - Get all categories
- `GET  /api/budgets` - Get budgets with spending data
- `GET  /api/analytics/stats` - Get dashboard statistics

## 🧪 Testing

Currently using demo data with a seeded user (`demo@expenseflow.com`). 

To test:
1. Visit the landing page at `/`
2. Click "View Dashboard"
3. Explore the analytics and charts

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your repository
- Vercel will auto-detect Next.js
- Add your `DATABASE_URL` environment variable
- Deploy!

3. **Run migrations in production**
```bash
# After first deployment
vercel env pull .env.production
npx prisma migrate deploy
npx prisma db seed
```

## 💡 Interview Talking Points

This project demonstrates:

### Full-Stack Capabilities
- ✅ Next.js 14 with App Router (Server Components + API Routes)
- ✅ TypeScript for type safety
- ✅ RESTful API design
- ✅ Database schema design with relationships
- ✅ Data validation (Zod)

### Best Practices
- ✅ Component composition and reusability
- ✅ Server-side rendering (SSR) for better performance
- ✅ Proper error handling
- ✅ Database query optimization (indexes)
- ✅ Type-safe database queries (Prisma)

### Modern Development
- ✅ Turbopack for fast development
- ✅ shadcn/ui for production-ready components
- ✅ Responsive design (mobile-first)
- ✅ Accessible UI components
- ✅ Clean, maintainable code structure

## 🤔 Why This Stack?

### Next.js 14
- Full-stack in one framework
- Server Components for better performance
- Easy deployment on Vercel
- Great developer experience

### Prisma
- Type-safe database queries
- Auto-generated TypeScript types
- Easy migrations
- Excellent documentation

### PostgreSQL (via Vercel)
- Serverless (scales to zero)
- Free tier available
- Production-ready
- ACID compliance

### shadcn/ui
- Copy-paste components (you own the code)
- Built on Radix UI (accessible)
- Customizable with Tailwind
- No runtime overhead

## 📖 Further Enhancements

Ideas for extending this project:

- [ ] Add authentication (NextAuth.js)
- [ ] Multi-user support
- [ ] Export data (CSV/PDF)
- [ ] Recurring transactions
- [ ] Mobile app (React Native)
- [ ] Real-time updates (WebSockets)
- [ ] Email notifications
- [ ] Receipt upload/scanning
- [ ] Multiple currencies
- [ ] Dark mode (already supported!)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Vercel](https://vercel.com/) - Deployment platform
- [Recharts](https://recharts.org/) - Charting library

## 📝 License

MIT

---

**Built with ❤️ for interview preparation and learning**

Need help? Check out:
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Database configuration guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete API reference

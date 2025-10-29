# 📚 ExpenseFlow API Documentation

Base URL: `/api`

## 🔐 Authentication

All endpoints require a `userId` parameter (currently passed as query param or in request body).
In production, this would be extracted from the auth session.

---

## 📊 Transactions

### GET `/api/transactions`
Get all transactions with optional filters.

**Query Parameters:**
- `userId` (required): User ID
- `type` (optional): `INCOME` | `EXPENSE` | `ALL`
- `categoryId` (optional): Filter by category
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Response:**
```json
[
  {
    "id": "clx...",
    "type": "EXPENSE",
    "amount": 45.50,
    "categoryId": "clx...",
    "description": "Lunch at restaurant",
    "date": "2024-10-29T12:00:00Z",
    "userId": "clx...",
    "createdAt": "2024-10-29T10:00:00Z",
    "updatedAt": "2024-10-29T10:00:00Z",
    "category": {
      "id": "clx...",
      "name": "Food & Dining",
      "icon": "🍕",
      "color": "#ef4444"
    }
  }
]
```

### POST `/api/transactions`
Create a new transaction.

**Request Body:**
```json
{
  "type": "EXPENSE",
  "amount": 45.50,
  "categoryId": "clx...",
  "description": "Lunch at restaurant",
  "date": "2024-10-29T12:00:00Z",
  "userId": "clx..."
}
```

### GET `/api/transactions/[id]`
Get a single transaction by ID.

### PUT `/api/transactions/[id]`
Update a transaction.

**Request Body:** (all fields optional)
```json
{
  "amount": 50.00,
  "description": "Updated description"
}
```

### DELETE `/api/transactions/[id]`
Delete a transaction.

---

## 🏷️ Categories

### GET `/api/categories`
Get all categories (system + user custom).

**Query Parameters:**
- `userId` (optional): Include user's custom categories
- `type` (optional): `INCOME` | `EXPENSE` | `ALL`

**Response:**
```json
[
  {
    "id": "clx...",
    "name": "Food & Dining",
    "icon": "🍕",
    "color": "#ef4444",
    "type": "EXPENSE",
    "userId": null,
    "createdAt": "2024-10-29T10:00:00Z"
  }
]
```

### POST `/api/categories`
Create a custom category.

**Request Body:**
```json
{
  "name": "My Custom Category",
  "icon": "🎮",
  "color": "#8b5cf6",
  "type": "EXPENSE",
  "userId": "clx..."
}
```

### DELETE `/api/categories/[id]`
Delete a custom category (system categories cannot be deleted).

---

## 💰 Budgets

### GET `/api/budgets`
Get all budgets with spending data.

**Query Parameters:**
- `userId` (required): User ID
- `month` (optional): First day of month (YYYY-MM-DD)

**Response:**
```json
[
  {
    "id": "clx...",
    "categoryId": "clx...",
    "amount": 500.00,
    "month": "2024-10-01T00:00:00Z",
    "userId": "clx...",
    "category": {
      "id": "clx...",
      "name": "Food & Dining",
      "icon": "🍕",
      "color": "#ef4444"
    },
    "spent": 325.50,
    "remaining": 174.50,
    "percentageUsed": 65.1,
    "isExceeded": false
  }
]
```

### POST `/api/budgets`
Create a new budget.

**Request Body:**
```json
{
  "categoryId": "clx...",
  "amount": 500.00,
  "month": "2024-10-01",
  "userId": "clx..."
}
```

### PUT `/api/budgets/[id]`
Update a budget.

**Request Body:** (fields optional)
```json
{
  "amount": 600.00
}
```

### DELETE `/api/budgets/[id]`
Delete a budget.

---

## 📈 Analytics

### GET `/api/analytics/stats`
Get comprehensive dashboard statistics.

**Query Parameters:**
- `userId` (required): User ID
- `month` (optional): Target month (YYYY-MM-DD), defaults to current

**Response:**
```json
{
  "summary": {
    "totalIncome": 5000.00,
    "totalExpenses": 2345.67,
    "netBalance": 2654.33,
    "incomeChange": 5.2,
    "expenseChange": -12.3
  },
  "categoryBreakdown": {
    "expenses": [
      {
        "categoryId": "clx...",
        "categoryName": "Food & Dining",
        "icon": "🍕",
        "color": "#ef4444",
        "amount": 450.00,
        "percentage": 19.2
      }
    ],
    "income": [...]
  },
  "recentTransactions": [...],
  "monthlyTrend": [
    {
      "month": "May 2024",
      "income": 5000,
      "expenses": 2100,
      "net": 2900
    }
  ],
  "period": {
    "start": "2024-10-01T00:00:00Z",
    "end": "2024-10-31T23:59:59Z",
    "label": "October 2024"
  }
}
```

---

## 🎨 Default Categories

The system comes with pre-seeded categories:

**Expense Categories:**
- 🍕 Food & Dining
- 🚗 Transportation
- 🛍️ Shopping
- 🎬 Entertainment
- 💡 Bills & Utilities
- 🏥 Healthcare
- 📚 Education
- ✈️ Travel
- 📦 Other Expenses

**Income Categories:**
- 💰 Salary
- 💼 Freelance
- 📈 Investments
- 🎁 Gifts
- 💵 Other Income

---

## ⚠️ Error Responses

All endpoints return standard error responses:

```json
{
  "error": "Error message",
  "details": {} // Optional, for validation errors
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error


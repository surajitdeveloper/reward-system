# Retailer Rewards Program

A comprehensive React application designed for a retailer to track and manage customer reward points based on purchase transactions over a three-month period.

## 🚀 Project Overview

This application calculates reward points based on the following logic:
- **2 points** for every dollar spent over $100 in each transaction.
- **1 point** for every dollar spent between $50 and $100 in each transaction.
- **Example:** A $120 purchase = 2 x $20 (over $100) + 1 x $50 (between $50 and $100) = **90 points**.

## 🛠️ Tech Stack

- **Frontend:** React JS (Functional Components, Hooks)
- **UI Library:** Material UI (MUI)
- **Routing:** React Router DOM
- **Data Visualization:** Recharts
- **Testing:** Jest & React Testing Library
- **State Management:** React Context API (No Redux)
- **Data:** Simulated Asynchronous API with local JSON

## 📂 Folder Structure

```text
src/
├── __tests__/          # Unit tests for logic and components
├── api/                # Mock API layer for data fetching
├── components/         # Reusable UI components
│   ├── auth/           # Login & Protected Route components
│   ├── customers/      # Table, Row, and Dialog components
│   ├── dashboard/      # Summary & Chart components
│   └── layout/         # Navbar, Sidebar, MainLayout
├── constants/          # Application constants & static data
├── context/            # AuthContext for state management
├── hooks/              # Custom hooks for fetching data
├── pages/              # Main page views (Dashboard, Customers, Rewards)
├── utils/              # Helper utilities (Calculator, Logger, Date formatting)
└── App.js              # Main App entry with Routing
```

## ⚙️ Project Setup & Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation Steps
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd reward-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000).

4. **Run Tests:**
   ```bash
   npm test
   ```

5. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

## 🧩 Component Details

### Core Components
- **Navbar**: Main header with app logo, title, and logout functionality.
- **Sidebar**: Collapsible navigation drawer for easy page switching.
- **MainLayout**: Higher-order component providing the consistent structure for authenticated pages.

### Customer Components
- **CustomerTable**: Features sorting (by Name, ID, Points), pagination, and real-time search filtering.
- **CustomerRow**: Uses MUI `Collapse` to show/hide a transaction summary for a better UX on large datasets.
- **TransactionRow**: Displays individual transaction details with color-coded point chips.
- **CustomerDetailsDialog**: A comprehensive "drill-down" view that calculates and displays rewards by month for the selected customer.

### Logic & Utilities
- **rewardCalculator**: The brain of the app. Handles whole and fractional numbers. Floors fractional dollars for point calculations to ensure conservative awarding.
- **logger**: Custom utility providing structured logging for API calls and responses in the browser console.

## 🔑 Login Credentials
- **Username:** `admin`
- **Password:** `admin123`

## 💡 Solution Details

- **Custom Hook Pattern:** Used `useCustomers` and `useTransactions` to encapsulate data fetching logic and loading states.
- **Reward Logic:** Implemented in `src/utils/rewardCalculator.js` to ensure pure functions that are easily testable.
- **Responsive Design:** Used MUI Grid and Box systems for a clean, responsive layout.
- **Logging:** Implemented a custom logger in `src/utils/logger.js` to track API interactions and application states.
- **Security:** Implemented `ProtectedRoute` to ensure only authenticated admins can access the dashboard.
- **UX Features:**
    - **Expandable Table:** Click on a customer row to see a quick summary of recent transactions.
    - **Drill-down Dialog:** Click the visibility icon to see a full monthly breakdown and total calculation.
    - **Dashboard:** Visual summary of points distribution using charts.
    - **Search & Sort:** Easily filter through 15+ customers.

## 🧪 Testing Scenarios

The application includes unit tests in `src/__tests__/rewardCalculator.test.js` covering:
- **Positive Scenarios:**
    - Correct calculation for amounts > $100 (e.g., $120).
    - Correct calculation for exactly $100.
    - Correct calculation for fractional values.
- **Negative Scenarios:**
    - Returns 0 for amounts < $50.
    - Returns 0 for invalid inputs (null, strings).
    - Returns 0 for negative amounts.

## 📸 Screenshots

*(Note: In a real submission, these would be actual image files)*

### 1. Login Screen
![Login Screen Placeholder](https://via.placeholder.com/800x450?text=Login+Screen+Screenshot)

### 2. Dashboard View
![Dashboard Placeholder](https://via.placeholder.com/800x450?text=Dashboard+View+Screenshot)

### 3. Customer List (Expandable Table)
![Customer List Placeholder](https://via.placeholder.com/800x450?text=Customer+List+Screenshot)

### 4. Reward Details Dialog
![Details Dialog Placeholder](https://via.placeholder.com/800x450?text=Reward+Details+Dialog+Screenshot)

### 5. Test Case Success
![Test Success Placeholder](https://via.placeholder.com/800x450?text=Test+Success+Screenshot)

---
*Created as part of the Rewards Program assignment.*

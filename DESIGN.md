# Expense Tracker - Architectural & Design Documentation

This document explains some of the key design decisions, algorithms, and methodologies chosen for this Full-Stack Expense Tracking application.

## 💰 Integer Money Handling

### The Problem with Floating Points
In traditional programming languages, utilizing floating-point numbers (`float32` or `float64`) to represent financial values inevitably leads to rounding errors and precision issues. This occurs due to how computers handle floating-point arithmetic essentially as approximations (e.g., `0.1 + 0.2` mapping to `0.30000000000000004`). In a billing system mapping splits to hundreds of shared users, pennies would quickly mismatch with total revenues.

### The Solution: Integer Cents
To solve this, our entire Backend Architecture stores and handles financial values as **Integer Cents** (`BIGINT`).
- A $50.00 charge is stored as `5000` inside PostgreSQL.
- The `Expense` models pass `int64` throughout the Go codebase.
- The `algorithm.OptimizeSettlements` safely computes remainders using division over integer mappings. 
- The Frontend layer converts values right before rendering (`Amount / 100`).

---

## 🧮 Settlement Optimization Algorithm

### The Goal
If User A owes User B $10, User B owes User C $10, and User C owes User D $10, we do not want 3 complex back-to-back manual transfers. Instead, User A should just pay User D $10.

### The Mechanism
1. **Net Balance Calculation:** The service aggregates every expense paid BY a user (Creditor factor) vs every split owed TO another user (Debtor factor). This produces a single `map[int64]int64` representing true net conditions.
2. **Separation:** Users are separated into a `creditors` array (Positive Net Balances) and a `debtors` array (Negative Net Balances).
3. **Greedy Matching:** The elements are sorted descending/ascending. We iteratively match the **largest debtor** with the **largest creditor**. This efficiently annihilates the two largest outliers of financial discrepancy.
4. **Transaction Logging:** We calculate `min(debt, credit)` and record that as an action/transaction node. By the end of this algorithm loop, we arrive at an incredibly optimized list of transfers mapping `User -> Pays -> User -> Amount`.

---

## 🎨 UI Design Decisions

We wanted the interface to look like an industry-standard B2B/B2C SaaS company (like a hybrid of Splitwise, Notion, and Stripe).

- **Colors:** Minimalist white backgrounds (`bg-gray-50` body) paired with a deeply vibrant aesthetic brand green accent (`brand-500/brand-600` mapping) provides trust, safety, and a financial context without being overwhelming.
- **Card-Based UI:** Information is nested inside modern, soft-rounded white containers with light `<1px` borders (`bg-white rounded-xl border border-gray-100 p-6`). This ensures cognitive distinction per expense or group.
- **Feedback & Interactions:** Interactive elements like inputs, modals, and list rows contain slight subtle fade/hover animations. Data displays are crisp using modern typography components mapped in generic structural shells (`components/Card.jsx`).

These design semantics prevent the application from looking like an amateur student project and instead highlight production-ready UX implementations.

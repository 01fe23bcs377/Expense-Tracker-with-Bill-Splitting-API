# SplitWise Pro - Expense Tracker & Bill Splitting Web Application

A beautiful, modern, professional full-stack application for tracking shared expenses, generating optimized settlement transfers, and managing group balances.

## 🌟 Features

- **Group Management**: Create customized groups for roommates, trips, or events.
- **Shared Expenses**: Safely handle money down to the integer cent. Add expenses and configure split conditions.
- **Optimized Settlements**: Core algorithmic engine that minimizes the total number of manual transfers needed between users.
- **Modern UI**: Polished, card-based interface crafted with React, Vite, and Tailwind CSS.
- **Robust Backend**: Fast, scalable Golang backend powered by Gin and PostgreSQL.

---

## 🏗 Architecture Overview

The system strictly adheres to clean layered architecture on the backend, ensuring a clear separation of concerns.

### Backend (`/backend`)
Framework: Go + Gin
Database: PostgreSQL
Design Pattern: Domain-Driven Layered Architecture

- `cmd/server/main.go`: The system entrypoint where database bindings, services, and middlewares are initialized.
- `internal/model/`: Defines data structures mapping precisely to database tables and domain objects.
- `internal/handler/`: Gin HTTP request/response handlers and payload bindings.
- `internal/service/`: Business logic validating incoming data.
- `internal/repository/`: The direct access data layer handling complex SQL queries with `sqlx`.
- `internal/algorithm/`: The settlement engine minimizing transaction count using greedy min-max math.

### Frontend (`/frontend`)
Framework: React + Vite
Styling: Tailwind CSS
Icons: `lucide-react`

- `src/api/`: Centralized HTTP requests utilizing Axios.
- `src/components/`: Pure, generic UI representations (`Card`, `Button`, `Input`, `Modal`).
- `src/layouts/`: Defines structural wrappers (MainLayout with sidebar and navbar).
- `src/pages/`: Rich complex views for Dashboard and GroupDetails.

---

## 🚀 How to Run

### Backend
1. Ensure you have Go 1.21+ and PostgreSQL installed.
2. Initialize and configure the database matching `backend/sql/schema.sql` (Default expects `postgres/postgres` credentials natively).
3. Navigate to `backend` directory: `cd backend`
4. Fetch dependencies (if `go.sum` is not initialized properly): `go mod tidy`
5. Start the server: `go run cmd/server/main.go`
   *Server will start on port `8080`.*

### Frontend
1. Make sure you have Node and NPM installed.
2. Navigate to the `frontend` directory: `cd frontend`
3. Install dependencies: `npm install`
4. Start the Vite dev server: `npm run dev`
   *Application will be natively available around `http://localhost:5173`.*

---

## 📖 API Endpoints

- `POST /api/groups` - Create a new group
- `GET /api/groups` - Retrieve all groups for the user dashboard dashboard
- `POST /api/groups/{id}/expenses` - Add an expense with specific cost splits
- `GET /api/groups/{id}/balances` - Calculate integer-safe net balances mapped by user
- `GET /api/groups/{id}/settlements` - Compute mathematically optimized minimum transactions

For more extensive system reasoning, refer to `DESIGN.md`.

---

## 🎥 Project Demo

[![Watch Demo]](https://drive.google.com/file/d/17KFMQKg5hgt28uinN8AbXXw5aYi4H57K/view?usp=drive_link)

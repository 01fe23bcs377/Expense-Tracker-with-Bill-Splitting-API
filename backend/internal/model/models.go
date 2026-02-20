package model

import "time"

type User struct {
	ID        int64     `db:"id" json:"id"`
	Name      string    `db:"name" json:"name"`
	Email     string    `db:"email" json:"email"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

type Group struct {
	ID          int64     `db:"id" json:"id"`
	Name        string    `db:"name" json:"name"`
	Description string    `db:"description" json:"description"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
}

type GroupMember struct {
	GroupID  int64     `db:"group_id" json:"group_id"`
	UserID   int64     `db:"user_id" json:"user_id"`
	JoinedAt time.Time `db:"joined_at" json:"joined_at"`
}

type Expense struct {
	ID          int64     `db:"id" json:"id"`
	GroupID     int64     `db:"group_id" json:"group_id"`
	PayerID     int64     `db:"payer_id" json:"payer_id"`
	Amount      int64     `db:"amount" json:"amount"` // Integer cents
	Description string    `db:"description" json:"description"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
}

type ExpenseSplit struct {
	ID         int64  `db:"id" json:"id"`
	ExpenseID  int64  `db:"expense_id" json:"expense_id"`
	UserID     int64  `db:"user_id" json:"user_id"`
	AmountOwed int64  `db:"amount_owed" json:"amount_owed"` // Integer cents
}

// Transaction represents a computed settlement between two users
type Transaction struct {
	FromUserID int64 `json:"from_user_id"`
	ToUserID   int64 `json:"to_user_id"`
	Amount     int64 `json:"amount"` // Integer cents
}

// UserBalance represents a user's net balance in a group
type UserBalance struct {
	UserID     int64 `json:"user_id"`
	NetBalance int64 `json:"net_balance"` // Positive means they are owed money, negative means they owe money
}

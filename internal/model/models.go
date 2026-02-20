package model

import (
	"time"
)

// User represents a user in the system.
type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"not null"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
}

// Group represents a collection of users who share expenses, like a trip or roommates.
type Group struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
}

// GroupMember represents the many-to-many relationship between Users and Groups.
type GroupMember struct {
	GroupID uint `json:"group_id" gorm:"primaryKey"`
	UserID  uint `json:"user_id" gorm:"primaryKey"`
}

// Expense represents a single expense paid by someone in a group.
// The Amount is stored in integer cents to completely avoid floating-point math issues.
type Expense struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	GroupID     uint      `json:"group_id" gorm:"not null;index"`
	PayerID     uint      `json:"payer_id" gorm:"not null;index"`
	Amount      int64     `json:"amount" gorm:"not null"` // Amount in cents
	Description string    `json:"description" gorm:"not null"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`

	// Relationships
	Splits []ExpenseSplit `json:"splits,omitempty" gorm:"foreignKey:ExpenseID"`
}

// ExpenseSplit represents how much a specific user owes for a particular expense.
type ExpenseSplit struct {
	ID        uint  `json:"id" gorm:"primaryKey"`
	ExpenseID uint  `json:"expense_id" gorm:"not null;index"`
	UserID    uint  `json:"user_id" gorm:"not null;index"`
	Amount    int64 `json:"amount" gorm:"not null"` // Amount in cents
}

// Settlement represents a calculated payment that needs to be made from one user to another.
// It is unpersisted, and only used for returning the results of the settlement algorithm.
type Settlement struct {
	FromUserID uint  `json:"from_user_id"`
	ToUserID   uint  `json:"to_user_id"`
	Amount     int64 `json:"amount"` // Amount in cents
}

// UserBalance represents the net balance for a user in a group.
type UserBalance struct {
	UserID  uint  `json:"user_id"`
	Balance int64 `json:"balance"` // Positive means owed money, negative means owes money
}

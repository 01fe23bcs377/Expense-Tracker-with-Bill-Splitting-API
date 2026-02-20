package repository

import (
	"context"

	"expense-tracker/internal/model"
)

type ExpenseRepository interface {
	CreateExpense(ctx context.Context, expense *model.Expense) error
	GetExpensesByGroupID(ctx context.Context, groupID uint) ([]model.Expense, error)
	GetExpenseSplitsByGroupID(ctx context.Context, groupID uint) ([]model.ExpenseSplit, error)
}

type expenseRepository struct {
	db *DB
}

func NewExpenseRepository(db *DB) ExpenseRepository {
	return &expenseRepository{db: db}
}

func (r *expenseRepository) CreateExpense(ctx context.Context, expense *model.Expense) error {
	// GORM's Create with associated slices (like Splits) will insert all within a transaction
	return r.db.WithContext(ctx).Create(expense).Error
}

func (r *expenseRepository) GetExpensesByGroupID(ctx context.Context, groupID uint) ([]model.Expense, error) {
	var expenses []model.Expense
	if err := r.db.WithContext(ctx).Where("group_id = ?", groupID).Find(&expenses).Error; err != nil {
		return nil, err
	}
	return expenses, nil
}

func (r *expenseRepository) GetExpenseSplitsByGroupID(ctx context.Context, groupID uint) ([]model.ExpenseSplit, error) {
	var splits []model.ExpenseSplit
	// Join expenses and expense_splits to find splits for a specific group
	err := r.db.WithContext(ctx).
		Joins("JOIN expenses ON expenses.id = expense_splits.expense_id").
		Where("expenses.group_id = ?", groupID).
		Find(&splits).Error
	if err != nil {
		return nil, err
	}
	return splits, nil
}

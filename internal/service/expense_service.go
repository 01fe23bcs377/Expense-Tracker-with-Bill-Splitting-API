package service

import (
	"context"
	"errors"

	"expense-tracker/internal/model"
	"expense-tracker/internal/repository"
)

var (
	ErrSplitMismatch = errors.New("the sum of expense splits does not equal the total amount")
)

type ExpenseService interface {
	AddExpense(ctx context.Context, groupID uint, payerID uint, amount int64, description string, splits []model.ExpenseSplit) (*model.Expense, error)
}

type expenseService struct {
	repo repository.ExpenseRepository
}

func NewExpenseService(repo repository.ExpenseRepository) ExpenseService {
	return &expenseService{repo: repo}
}

func (s *expenseService) AddExpense(ctx context.Context, groupID uint, payerID uint, amount int64, description string, splits []model.ExpenseSplit) (*model.Expense, error) {
	// Validate that the splits sum up to the total amount
	var splitSum int64
	for _, split := range splits {
		splitSum += split.Amount
	}

	if splitSum != amount {
		return nil, ErrSplitMismatch
	}

	expense := &model.Expense{
		GroupID:     groupID,
		PayerID:     payerID,
		Amount:      amount,
		Description: description,
		Splits:      splits,
	}

	if err := s.repo.CreateExpense(ctx, expense); err != nil {
		return nil, err
	}

	return expense, nil
}

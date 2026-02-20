package service

import (
	"context"

	"expense-tracker/internal/algorithm"
	"expense-tracker/internal/model"
	"expense-tracker/internal/repository"
)

type SettlementService interface {
	CalculateBalances(ctx context.Context, groupID uint) ([]model.UserBalance, error)
	GetSettlements(ctx context.Context, groupID uint) ([]model.Settlement, error)
}

type settlementService struct {
	expenseRepo repository.ExpenseRepository
}

func NewSettlementService(expenseRepo repository.ExpenseRepository) SettlementService {
	return &settlementService{expenseRepo: expenseRepo}
}

func (s *settlementService) CalculateBalances(ctx context.Context, groupID uint) ([]model.UserBalance, error) {
	expenses, err := s.expenseRepo.GetExpensesByGroupID(ctx, groupID)
	if err != nil {
		return nil, err
	}

	splits, err := s.expenseRepo.GetExpenseSplitsByGroupID(ctx, groupID)
	if err != nil {
		return nil, err
	}

	// Calculate net balances
	// positive balance = person is owed money
	// negative balance = person owes money
	balancesMap := make(map[uint]int64)

	// Add what each person paid (they are owed this money)
	for _, exp := range expenses {
		balancesMap[exp.PayerID] += exp.Amount
	}

	// Subtract what each person owes (their share of the expense)
	for _, split := range splits {
		balancesMap[split.UserID] -= split.Amount
	}

	var userBalances []model.UserBalance
	for userID, balance := range balancesMap {
		if balance != 0 {
			userBalances = append(userBalances, model.UserBalance{
				UserID:  userID,
				Balance: balance,
			})
		}
	}

	return userBalances, nil
}

func (s *settlementService) GetSettlements(ctx context.Context, groupID uint) ([]model.Settlement, error) {
	balances, err := s.CalculateBalances(ctx, groupID)
	if err != nil {
		return nil, err
	}

	// Use algorithm to minimize transactions
	return algorithm.CalculateSettlements(balances), nil
}

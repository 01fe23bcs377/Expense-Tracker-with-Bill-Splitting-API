package service

import (
	"expense-tracker/internal/algorithm"
	"expense-tracker/internal/model"
	"expense-tracker/internal/repository"
)

type ExpenseService struct {
	repo *repository.Repository
}

func NewExpenseService(repo *repository.Repository) *ExpenseService {
	return &ExpenseService{repo: repo}
}

func (s *ExpenseService) CreateUser(name, email string) (*model.User, error) {
	user := &model.User{
		Name:  name,
		Email: email,
	}
	err := s.repo.CreateUser(user)
	return user, err
}

func (s *ExpenseService) GetUsers() ([]model.User, error) {
	return s.repo.GetUsers()
}

func (s *ExpenseService) CreateGroup(name, description string) (*model.Group, error) {
	group := &model.Group{
		Name:        name,
		Description: description,
	}
	err := s.repo.CreateGroup(group)
	return group, err
}

func (s *ExpenseService) GetGroups() ([]model.Group, error) {
	return s.repo.GetGroups()
}

func (s *ExpenseService) AddExpense(groupID, payerID int64, amount int64, description string, splits []model.ExpenseSplit) (*model.Expense, error) {
	expense := &model.Expense{
		GroupID:     groupID,
		PayerID:     payerID,
		Amount:      amount,
		Description: description,
	}
	
	s.repo.AddUserToGroup(groupID, payerID)
	for _, split := range splits {
		s.repo.AddUserToGroup(groupID, split.UserID)
	}

	err := s.repo.AddExpense(expense, splits)
	return expense, err
}

func (s *ExpenseService) GetGroupBalances(groupID int64) ([]model.UserBalance, error) {
	balancesMap, err := s.repo.GetGroupBalances(groupID)
	if err != nil {
		return nil, err
	}

	var balances []model.UserBalance
	for id, net := range balancesMap {
		balances = append(balances, model.UserBalance{
			UserID:     id,
			NetBalance: net,
		})
	}

	return balances, nil
}

func (s *ExpenseService) GetGroupSettlements(groupID int64) ([]model.Transaction, error) {
	balancesMap, err := s.repo.GetGroupBalances(groupID)
	if err != nil {
		return nil, err
	}

	transactions := algorithm.OptimizeSettlements(balancesMap)
	return transactions, nil
}

func (s *ExpenseService) GetAllExpenses() ([]model.Expense, error) {
	return s.repo.GetAllExpenses()
}

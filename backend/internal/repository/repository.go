package repository

import (
	"expense-tracker/internal/model"
	"sync"
	"time"
)

type Repository struct {
	mu           sync.Mutex
	users        map[int64]*model.User
	groups       map[int64]*model.Group
	expenses     map[int64]*model.Expense
	splits       map[int64]*model.ExpenseSplit
	groupMembers map[int64]map[int64]bool

	nextUserID    int64
	nextGroupID   int64
	nextExpenseID int64
	nextSplitID   int64
}

func NewRepository(db interface{}) *Repository {
	return &Repository{
		users:        make(map[int64]*model.User),
		groups:       make(map[int64]*model.Group),
		expenses:     make(map[int64]*model.Expense),
		splits:       make(map[int64]*model.ExpenseSplit),
		groupMembers: make(map[int64]map[int64]bool),

		nextUserID:    1,
		nextGroupID:   1,
		nextExpenseID: 1,
		nextSplitID:   1,
	}
}

func (r *Repository) CreateUser(user *model.User) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	user.ID = r.nextUserID
	r.nextUserID++
	user.CreatedAt = time.Now()

	uCopy := *user
	r.users[user.ID] = &uCopy
	return nil
}

func (r *Repository) GetUsers() ([]model.User, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	var result []model.User
	for _, u := range r.users {
		result = append(result, *u)
	}
	return result, nil
}

func (r *Repository) CreateGroup(group *model.Group) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	group.ID = r.nextGroupID
	r.nextGroupID++
	group.CreatedAt = time.Now()

	groupCopy := *group
	r.groups[group.ID] = &groupCopy
	return nil
}

func (r *Repository) GetGroups() ([]model.Group, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	var result []model.Group
	for _, g := range r.groups {
		result = append(result, *g)
	}
	return result, nil
}

func (r *Repository) GetGroupByID(id int64) (*model.Group, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	g, exists := r.groups[id]
	if !exists {
		return nil, nil
	}
	gCopy := *g
	return &gCopy, nil
}

func (r *Repository) AddUserToGroup(groupID, userID int64) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.groupMembers[groupID]; !ok {
		r.groupMembers[groupID] = make(map[int64]bool)
	}
	r.groupMembers[groupID][userID] = true
	return nil
}

func (r *Repository) AddExpense(expense *model.Expense, splits []model.ExpenseSplit) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	expense.ID = r.nextExpenseID
	r.nextExpenseID++
	expense.CreatedAt = time.Now()

	eCopy := *expense
	r.expenses[expense.ID] = &eCopy

	for i := range splits {
		splits[i].ID = r.nextSplitID
		r.nextSplitID++
		splits[i].ExpenseID = expense.ID
		
		sCopy := splits[i]
		r.splits[sCopy.ID] = &sCopy
	}

	return nil
}

func (r *Repository) GetGroupBalances(groupID int64) (map[int64]int64, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	balances := make(map[int64]int64)

	// Add amounts users paid (they are creditors for this amount)
	for _, e := range r.expenses {
		if e.GroupID == groupID {
			balances[e.PayerID] += e.Amount
		}
	}

	// Subtract amounts users owe from splits (they are debtors for this amount)
	for _, s := range r.splits {
		if e, ok := r.expenses[s.ExpenseID]; ok {
			if e.GroupID == groupID {
				balances[s.UserID] -= s.AmountOwed
			}
		}
	}

	return balances, nil
}

func (r *Repository) GetAllExpenses() ([]model.Expense, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	var result []model.Expense
	for _, e := range r.expenses {
		result = append(result, *e)
	}
	return result, nil
}

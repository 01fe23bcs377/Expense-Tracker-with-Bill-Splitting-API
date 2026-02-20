package algorithm

import (
	"sort"
	"expense-tracker/internal/model"
)

// PersonBalance holds the user ID and their net balance
type PersonBalance struct {
	UserID  int64
	Balance int64
}

// OptimizeSettlements calculates the minimum number of transactions to settle debts.
// It takes a map of user_id -> net_balance. 
// Positive balance: user needs to receive money (creditor)
// Negative balance: user needs to pay money (debtor)
func OptimizeSettlements(balances map[int64]int64) []model.Transaction {
	var debtors []PersonBalance
	var creditors []PersonBalance

	// Separate into debtors and creditors
	for id, balance := range balances {
		if balance < 0 {
			debtors = append(debtors, PersonBalance{UserID: id, Balance: balance}) // balance is negative
		} else if balance > 0 {
			creditors = append(creditors, PersonBalance{UserID: id, Balance: balance}) // balance is positive
		}
	}

	// Sort debtors ascending (most negative first) and creditors descending (most positive first)
	// This greedy approach (matching largest debtor with largest creditor) often minimizes transaction count
	sort.Slice(debtors, func(i, j int) bool {
		return debtors[i].Balance < debtors[j].Balance
	})
	
	sort.Slice(creditors, func(i, j int) bool {
		return creditors[i].Balance > creditors[j].Balance
	})

	var transactions []model.Transaction

	i := 0 // index for debtors
	j := 0 // index for creditors

	for i < len(debtors) && j < len(creditors) {
		debt := -debtors[i].Balance // convert to positive amount
		credit := creditors[j].Balance

		// Find the minimum of the debt and credit
		settleAmount := min(debt, credit)

		// Create a transaction from debtor to creditor
		transactions = append(transactions, model.Transaction{
			FromUserID: debtors[i].UserID,
			ToUserID:   creditors[j].UserID,
			Amount:     settleAmount,
		})

		// Adjust balances
		debtors[i].Balance += settleAmount
		creditors[j].Balance -= settleAmount

		// Move indices if balances are settled
		if debtors[i].Balance == 0 {
			i++
		}
		if creditors[j].Balance == 0 {
			j++
		}
	}

	return transactions
}

func min(a, b int64) int64 {
	if a < b {
		return a
	}
	return b
}

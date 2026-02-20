package algorithm

import (
	"sort"

	"expense-tracker/internal/model"
)

// CalculateSettlements calculates the minimum number of transactions required to settle all debts.
// It uses a greedy approach: it always matches the person who owes the most with
// the person who is owed the most.
//
// Time Complexity: O(N log N) where N is the number of users involved, due to sorting
// the debtors and creditors arrays in the worst case per iteration. Optimization could
// use a max-heap/min-heap to make it O(N log N) overall more cleanly, but for typical
// group sizes (e.g., < 100), sorting is very fast and the code is simpler to read.
// A simpler O(N log N) approach is sorting once and using two pointers if we don't need
// exact match minimization, but to strictly find matching exact amounts we might need 
// more complex logic. The greedy approach here is a common approximation for NP-hard
// subset-sum problem variants, and guarantees at most N-1 transactions.
func CalculateSettlements(balances []model.UserBalance) []model.Settlement {
	var debtors []model.UserBalance   // people who owe money (balance < 0)
	var creditors []model.UserBalance // people who are owed money (balance > 0)

	// 1. Separate creditors and debtors
	for _, b := range balances {
		if b.Balance < 0 {
			// Store as positive debt magnitude for easier calculation
			b.Balance = -b.Balance
			debtors = append(debtors, b)
		} else if b.Balance > 0 {
			creditors = append(creditors, b)
		}
	}

	var settlements []model.Settlement

	// 2. Iteratively match highest creditor with highest debtor
	for len(debtors) > 0 && len(creditors) > 0 {
		// Sort to get the highest debtor and highest creditor at the end of the slice (index len-1)
		sort.Slice(debtors, func(i, j int) bool {
			return debtors[i].Balance < debtors[j].Balance
		})
		sort.Slice(creditors, func(i, j int) bool {
			return creditors[i].Balance < creditors[j].Balance
		})

		// Get largest debtor and creditor
		debtorIdx := len(debtors) - 1
		creditorIdx := len(creditors) - 1

		debtor := &debtors[debtorIdx]
		creditor := &creditors[creditorIdx]

		// Find the minimum of the two amounts to settle
		settledAmount := debtor.Balance
		if creditor.Balance < settledAmount {
			settledAmount = creditor.Balance
		}

		// Create settlement transaction
		// Note from debtor's perspective: they OWE money, so FromUser = debtor, ToUser = creditor
		settlements = append(settlements, model.Settlement{
			FromUserID: debtor.UserID,
			ToUserID:   creditor.UserID,
			Amount:     settledAmount,
		})

		// Deduct the settled amount
		debtor.Balance -= settledAmount
		creditor.Balance -= settledAmount

		// If debtor is fully settled, remove from list
		if debtor.Balance == 0 {
			debtors = debtors[:debtorIdx]
		}
		// If creditor is fully settled, remove from list
		if creditor.Balance == 0 {
			creditors = creditors[:creditorIdx]
		}
	}

	return settlements
}

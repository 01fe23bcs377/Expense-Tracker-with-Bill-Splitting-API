package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"expense-tracker/internal/model"
	"expense-tracker/internal/service"
)

type ExpenseHandler struct {
	expenseService service.ExpenseService
}

func NewExpenseHandler(expenseService service.ExpenseService) *ExpenseHandler {
	return &ExpenseHandler{expenseService: expenseService}
}

type CreateExpenseRequest struct {
	PayerID     uint   `json:"payer_id" binding:"required"`
	Amount      int64  `json:"amount" binding:"required,gt=0"`
	Description string `json:"description" binding:"required"`
	Splits      []struct {
		UserID uint  `json:"user_id" binding:"required"`
		Amount int64 `json:"amount" binding:"required,gt=0"`
	} `json:"splits" binding:"required,min=1"`
}

// AddExpense handles POST /groups/{id}/expenses
func (h *ExpenseHandler) AddExpense(c *gin.Context) {
	groupIDParam := c.Param("id")
	groupID, err := strconv.ParseUint(groupIDParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid group ID"})
		return
	}

	var req CreateExpenseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	splits := make([]model.ExpenseSplit, len(req.Splits))
	for i, s := range req.Splits {
		splits[i] = model.ExpenseSplit{
			UserID: s.UserID,
			Amount: s.Amount,
		}
	}

	expense, err := h.expenseService.AddExpense(c.Request.Context(), uint(groupID), req.PayerID, req.Amount, req.Description, splits)
	if err != nil {
		if err == service.ErrSplitMismatch {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add expense"})
		return
	}

	c.JSON(http.StatusCreated, expense)
}

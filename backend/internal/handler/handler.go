package handler

import (
	"net/http"
	"strconv"

	"expense-tracker/internal/model"
	"expense-tracker/internal/service"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	svc *service.ExpenseService
}

func NewHandler(svc *service.ExpenseService) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) CreateUser(c *gin.Context) {
	var req struct {
		Name  string `json:"name" binding:"required"`
		Email string `json:"email" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.svc.CreateUser(req.Name, req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}
	c.JSON(http.StatusCreated, user)
}

func (h *Handler) GetUsers(c *gin.Context) {
	users, err := h.svc.GetUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get users"})
		return
	}
	if users == nil {
		users = []model.User{}
	}
	c.JSON(http.StatusOK, users)
}

func (h *Handler) CreateGroup(c *gin.Context) {
	var req struct {
		Name        string `json:"name" binding:"required"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	group, err := h.svc.CreateGroup(req.Name, req.Description)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create group"})
		return
	}
	c.JSON(http.StatusCreated, group)
}

func (h *Handler) GetGroups(c *gin.Context) {
	groups, err := h.svc.GetGroups()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch groups"})
		return
	}
	if groups == nil {
		groups = []model.Group{}
	}
	c.JSON(http.StatusOK, groups)
}

func (h *Handler) AddExpense(c *gin.Context) {
	groupIDStr := c.Param("id")
	groupID, err := strconv.ParseInt(groupIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid group ID"})
		return
	}

	var req struct {
		PayerID     int64                `json:"payer_id" binding:"required"`
		Amount      int64                `json:"amount" binding:"required"`
		Description string               `json:"description" binding:"required"`
		Splits      []model.ExpenseSplit `json:"splits" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var totalSplit int64
	for _, split := range req.Splits {
		totalSplit += split.AmountOwed
	}
	if totalSplit != req.Amount {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Sum of splits must equal the total amount"})
		return
	}

	expense, err := h.svc.AddExpense(groupID, req.PayerID, req.Amount, req.Description, req.Splits)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add expense"})
		return
	}
	c.JSON(http.StatusCreated, expense)
}

func (h *Handler) GetBalances(c *gin.Context) {
	groupIDStr := c.Param("id")
	groupID, err := strconv.ParseInt(groupIDStr, 10, 64)
	if err != nil {
		return
	}

	balances, err := h.svc.GetGroupBalances(groupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get balances"})
		return
	}
	if balances == nil {
		balances = []model.UserBalance{}
	}
	c.JSON(http.StatusOK, balances)
}

func (h *Handler) GetSettlements(c *gin.Context) {
	groupIDStr := c.Param("id")
	groupID, err := strconv.ParseInt(groupIDStr, 10, 64)
	if err != nil {
		return
	}

	settlements, err := h.svc.GetGroupSettlements(groupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get settlements"})
		return
	}
	if settlements == nil {
		settlements = []model.Transaction{}
	}
	c.JSON(http.StatusOK, settlements)
}

func (h *Handler) GetActivities(c *gin.Context) {
	expenses, err := h.svc.GetAllExpenses()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get activities"})
		return
	}
	if expenses == nil {
		expenses = []model.Expense{}
	}
	c.JSON(http.StatusOK, expenses)
}

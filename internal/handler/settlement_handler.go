package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"expense-tracker/internal/service"
)

type SettlementHandler struct {
	settlementService service.SettlementService
}

func NewSettlementHandler(settlementService service.SettlementService) *SettlementHandler {
	return &SettlementHandler{settlementService: settlementService}
}

// GetBalances handles GET /groups/{id}/balances
func (h *SettlementHandler) GetBalances(c *gin.Context) {
	groupIDParam := c.Param("id")
	groupID, err := strconv.ParseUint(groupIDParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid group ID"})
		return
	}

	balances, err := h.settlementService.CalculateBalances(c.Request.Context(), uint(groupID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate balances"})
		return
	}

	c.JSON(http.StatusOK, balances)
}

// GetSettlements handles GET /groups/{id}/settlements
func (h *SettlementHandler) GetSettlements(c *gin.Context) {
	groupIDParam := c.Param("id")
	groupID, err := strconv.ParseUint(groupIDParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid group ID"})
		return
	}

	settlements, err := h.settlementService.GetSettlements(c.Request.Context(), uint(groupID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate settlements"})
		return
	}

	c.JSON(http.StatusOK, settlements)
}

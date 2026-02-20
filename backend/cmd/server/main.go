package main

import (
	"log"
	"os"

	"expense-tracker/internal/handler"
	"expense-tracker/internal/repository"
	"expense-tracker/internal/service"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize Layers with our in-memory datastore
	// This circumvents the need to setup PostgreSQL locally for runtime evaluation
	repo := repository.NewRepository(nil)
	svc := service.NewExpenseService(repo)
	h := handler.NewHandler(svc)

	// Setup Gin Router
	r := gin.Default()

	// Handle CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Routes
	api := r.Group("/api")
	{
		api.POST("/users", h.CreateUser)
		api.GET("/users", h.GetUsers)
		api.POST("/groups", h.CreateGroup)
		api.GET("/groups", h.GetGroups)
		api.POST("/groups/:id/expenses", h.AddExpense)
		api.GET("/groups/:id/balances", h.GetBalances)
		api.GET("/groups/:id/settlements", h.GetSettlements)
		api.GET("/activities", h.GetActivities)
	}

	// Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s (In-Memory DB Mode)", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

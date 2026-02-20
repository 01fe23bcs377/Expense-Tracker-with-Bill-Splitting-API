package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"

	"expense-tracker/internal/config"
	"expense-tracker/internal/handler"
	"expense-tracker/internal/middleware"
	"expense-tracker/internal/repository"
	"expense-tracker/internal/service"
)

func main() {
	// 1. Load Configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// 2. Initialize Database Connection
	db, err := repository.NewDB(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// 3. Initialize Repositories
	groupRepo := repository.NewGroupRepository(db)
	expenseRepo := repository.NewExpenseRepository(db)

	// 4. Initialize Services
	groupService := service.NewGroupService(groupRepo)
	expenseService := service.NewExpenseService(expenseRepo)
	settlementService := service.NewSettlementService(expenseRepo)

	// 5. Initialize Handlers
	groupHandler := handler.NewGroupHandler(groupService)
	expenseHandler := handler.NewExpenseHandler(expenseService)
	settlementHandler := handler.NewSettlementHandler(settlementService)

	// 6. Setup Gin Router
	gin.SetMode(gin.ReleaseMode) // Use release mode in production
	router := gin.New()

	// Use structured JSON logger instead of standard gin logger
	router.Use(middleware.RequestLogger())
	// Use gin recovery and custom error handler
	router.Use(gin.Recovery())
	router.Use(middleware.ErrorHandler())

	// 7. Register Routes
	v1 := router.Group("/v1")
	{
		v1.POST("/groups", groupHandler.CreateGroup)
		v1.POST("/groups/:id/expenses", expenseHandler.AddExpense)
		v1.GET("/groups/:id/balances", settlementHandler.GetBalances)
		v1.GET("/groups/:id/settlements", settlementHandler.GetSettlements)
	}

	// Simple healthcheck
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "UP"})
	})

	// 8. Start Server with Graceful Shutdown
	srv := &http.Server{
		Addr:    ":" + cfg.ServerPort,
		Handler: router,
	}

	go func() {
		log.Printf("Starting Server on port %s", cfg.ServerPort)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Listen and Serve error: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exiting")
}

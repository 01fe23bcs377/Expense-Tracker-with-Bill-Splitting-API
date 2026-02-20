package repository

import (
	"context"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"expense-tracker/internal/config"
)

// DB represents the database connection wrapping GORM
type DB struct {
	*gorm.DB
}

// NewDB initializes the standard postgres DB connection
func NewDB(cfg *config.AppConfig) (*DB, error) {
	db, err := gorm.Open(postgres.Open(cfg.GetDSN()), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, err
	}

	return &DB{db}, nil
}

// Transaction executes the given function within a database transaction
func (db *DB) Transaction(ctx context.Context, fn func(tx *gorm.DB) error) error {
	return db.WithContext(ctx).Transaction(fn)
}

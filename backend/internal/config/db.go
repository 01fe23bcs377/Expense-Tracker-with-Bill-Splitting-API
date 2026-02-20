package config

import (
	"log"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

// InitDB initializes the database connection
func InitDB(connStr string) (*sqlx.DB, error) {
	db, err := sqlx.Connect("postgres", connStr)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	log.Println("Successfully connected to the database")
	return db, nil
}

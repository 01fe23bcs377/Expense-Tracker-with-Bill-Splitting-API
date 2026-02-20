package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// AppConfig holds the application configuration
type AppConfig struct {
	ServerPort string
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
}

// LoadConfig loads configuration from the environment, optionally reading from a .env file
func LoadConfig() (*AppConfig, error) {
	// Ignore error if .env doesn't exist; we can read from ENV vars directly
	_ = godotenv.Load()

	cfg := &AppConfig{
		ServerPort: getEnv("SERVER_PORT", "8080"),
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", "postgres"),
		DBName:     getEnv("DB_NAME", "expense_tracker"),
	}

	return cfg, nil
}

// GetDSN returns the database connection string
func (c *AppConfig) GetDSN() string {
	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		c.DBHost, c.DBUser, c.DBPassword, c.DBName, c.DBPort)
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

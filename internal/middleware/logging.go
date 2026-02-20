package middleware

import (
	"log/slog"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

var Logger *slog.Logger

func init() {
	// Initialize a structured JSON logger for production readiness
	Logger = slog.New(slog.NewJSONHandler(os.Stdout, nil))
}

// RequestLogger is a Gin middleware that logs each request structured as JSON
func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		path := c.Request.URL.Path
		query := c.Request.URL.RawQuery

		c.Next()

		end := time.Now()
		latency := end.Sub(start)

		Logger.Info("handled request",
			slog.Int("status", c.Writer.Status()),
			slog.String("method", c.Request.Method),
			slog.String("path", path),
			slog.String("query", query),
			slog.String("ip", c.ClientIP()),
			slog.String("latency", latency.String()),
			slog.String("errors", c.Errors.String()),
		)
	}
}

package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// ErrorHandler is a middleware that intercepts unhandled panics or explicit errors
// and formats them into a standard JSON response.
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		// If there are errors attached to the request context
		if len(c.Errors) > 0 {
			c.JSON(http.StatusInternalServerError, gin.H{
				"errors": c.Errors.Errors(),
			})
		}
	}
}

package middleware

import (
	"context"
	"net/http"
	"time"

	"coworkspace/utils"
)

type key string

const (
	UserIDKey   key = "user_id"
	UserRoleKey key = "user_role"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("access_token")
		if err != nil {
			utils.SendError(w, http.StatusUnauthorized, "TOKEN_EXPIRED")
			return
		}

		claims, err := utils.ParseToken(cookie.Value)
		if err != nil {
			utils.SendError(w, http.StatusUnauthorized, "Token invalide")
			return
		}

		expFloat, ok := claims["exp"].(float64)
		if !ok || int64(expFloat) < time.Now().Unix() {
			utils.SendError(w, http.StatusUnauthorized, "TOKEN_EXPIRED")
			return
		}

		userIDFloat, ok := claims["user_id"].(float64)
		if !ok {
			utils.SendError(w, http.StatusUnauthorized, "ID utilisateur invalide")
			return
		}
		userID := int(userIDFloat)

		role, ok := claims["role"].(string)
		if !ok {
			utils.SendError(w, http.StatusUnauthorized, "Role invalide")
			return
		}

		ctx := context.WithValue(r.Context(), UserIDKey, userID)
		ctx = context.WithValue(ctx, UserRoleKey, role)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
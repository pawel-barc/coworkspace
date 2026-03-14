package middleware

import (
	"coworkspace/utils"
	"net/http"
)

func UserMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		role, ok := r.Context().Value(UserRoleKey).(string)
		if !ok || role != "user" {
			utils.SendError(w, http.StatusForbidden, "Accès réservé aux utilisateurs standards")
			return
		}
		next.ServeHTTP(w, r)
	})
}
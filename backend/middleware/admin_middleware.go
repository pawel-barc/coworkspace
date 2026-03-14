package middleware

import (
	"coworkspace/utils"
	"net/http"
)

func AdminMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		role, ok := r.Context().Value(UserRoleKey).(string)
		if !ok || role != "admin" {
			utils.SendError(w, http.StatusForbidden, "Accès réservé aux administrateurs")
			return
		}
		next.ServeHTTP(w, r)
	})
}
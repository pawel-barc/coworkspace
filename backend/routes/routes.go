package routes

import (
	"net/http"

	"coworkspace/controllers"
	"coworkspace/middleware"

	"github.com/go-chi/chi/v5"
)

// SetupRouter configure toutes les routes de l'application
func SetupRouter() http.Handler {
	r := chi.NewRouter()

	// Middleware global pour toutes les routes
	r.Use(middleware.CORSHandler())

	fs := http.FileServer(http.Dir("./assets"))
	r.Handle("/assets/*", http.StripPrefix("/assets/", fs))

	// ----- ROUTES PUBLIQUES -----
	// Identification et Authorization
	r.Post("/register", controllers.Register)       // Inscription
	r.Post("/login", controllers.Login)             // Connexion
	r.Post("/refresh-token", controllers.RefreshToken) // Rafraîchissement du token
	r.Get("/verify-email", controllers.VerifyEmail)    // Vérification email

	// Les espaces
	r.Get("/spaces/{id}/full", controllers.GetFullSpace)  // Les espaces mis en publique
	r.Get("/spaces", controllers.GetSpaces)

	// ----- ROUTES POUR TOUS LES UTILISATEURS CONNECTÉS -----
	r.Group(func(r chi.Router) {
		// Middleware: utilisateur doit être connecté (JWT)
		r.Use(middleware.AuthMiddleware)

		r.Post("/logout", controllers.Logout) // Déconnexion

		// ----- ROUTES POUR LES USERS STANDARDS -----
		r.Group(func(r chi.Router) {
			// Middleware: vérifie que c'est un utilisateur standard
			r.Use(middleware.UserMiddleware)

				r.Get("/spaces/{id}", controllers.GetSpaceByID)
				r.Get("/spaces/{id}/reservations", controllers.GetSpaceReservations)

			// Réservations user

			r.Post("/reservations", controllers.CreateReservation)
			r.Get("/reservations", controllers.GetUserReservations)
			r.Patch("/reservations/{id}", controllers.UpdateReservation)
			r.Delete("/reservations/{id}", controllers.DeleteReservation)

			// Exemple: profil utilisateur
			// r.Get("/user/profile", controllers.UserProfile)
			// r.Get("/user/spaces", controllers.UserSpaces)
		})
	})

	// ----- ROUTES ADMIN -----
	r.Group(func(r chi.Router) {
		// Middleware: utilisateur doit être connecté + rôle admin
		r.Use(middleware.AuthMiddleware)
		r.Use(middleware.AdminMiddleware)

		r.Post("/admin/spaces", controllers.CreateSpace)
		r.Get("/admin/spaces", controllers.GetAdminSpaces)
		r.Get("/admin/spaces/{id}", controllers.GetSpaceByID)
		r.Patch("/admin/spaces/{id}", controllers.UpdateSpace)
		r.Delete("/admin/spaces/{id}", controllers.DeleteSpace)


		
		r.Post("/admin/equipments", controllers.CreateEquipment)
		r.Get("/admin/equipments", controllers.GetAllEquipment)
		r.Get("/admin/equipments/{id}", controllers.GetEquipmentByID)
		r.Patch("/admin/equipments/{id}", controllers.UpdateEquipment)
		r.Delete("/admin/equipments/{id}", controllers.DeleteEquipment)	
		r.Get("/admin/spaces/{id}/equipments", controllers.GetEquipmentBySpace)


		r.Post("/admin/desks", controllers.CreateDesk)
		r.Get("/admin/desks", controllers.GetAllDesks)
		r.Get("/admin/desks/{id}", controllers.GetDeskByID)
		r.Patch("/admin/desks/{id}", controllers.UpdateDesk)
		r.Delete("/admin/desks/{id}", controllers.DeleteDesk)

		// Réservations Admin
			// Reservations
		r.Get("/admin/reservations", controllers.GetAllReservations)
		r.Patch("/admin/reservations/{id}/status", controllers.UpdateReservationStatus)
		r.Patch("/admin/reservations/{id}", controllers.UpdateAdminReservation)
		r.Delete("/admin/reservations/{id}", controllers.DeleteAdminReservation)

		// Exemple: gestion des utilisateurs et espaces par l'admin
		// r.Get("/admin/users", controllers.AdminListUsers)
		// r.Post("/admin/spaces", controllers.AdminCreateSpace)
	})

	return r
}
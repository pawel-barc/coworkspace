package main

import (
	"fmt"
	"net/http"

	// "os"

	"coworkspace/controllers"
	"coworkspace/db"
	"coworkspace/repositories"
	"coworkspace/routes"
	"coworkspace/services"
)

func main() {

	// Connexion à la base de données
	db.ConnectDB()
	repositories.SpaceRepo = &repositories.SpaceRepository{DB: db.DB}
	repositories.EquipmentRepo = &repositories.EquipmentRepository{DB: db.DB,}
	repositories.DeskRepo = &repositories.DeskRepository{DB: db.DB,}
	reservationRepo := &repositories.ReservationRepository{DB: db.DB}
	reservationService := &services.ReservationService{Repo: reservationRepo}
	controllers.ReservationService = reservationService
	// ----------------------------
	// MIGRATION: création de la base des données
	// ----------------------------
	// sqlBytes, err := os.ReadFile("db/migrations/001_init.sql")
	// if err != nil {
	// 	fmt.Printf("Impossible de lire le fichier de migration: %v\n", err)
	// 	panic(err)
	// }

	// _, err = db.DB.Exec(string(sqlBytes))
	// if err != nil {
	// 	fmt.Printf("Erreur lors de l'exécution de la migration: %v\n", err)
	// 	panic(err)
	// }

	// fmt.Println("Migration exécutée avec succès")

	// ----------------------------
	// Configuration du routeur
	// ----------------------------
	router := routes.SetupRouter()

	// Message d'information dans le terminal
	fmt.Println("Démarrage du serveur sur :8080...")

	// Lancement du serveur HTTP et gestion des erreurs éventuelles
	if err := http.ListenAndServe(":8080", router); err != nil {
		fmt.Printf("Erreur lors du démarrage du serveur: %v\n", err)
		panic(err)
	}
}
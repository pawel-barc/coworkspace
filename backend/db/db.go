package db

import (
	"database/sql"
	"fmt"

	"coworkspace/config"

	_ "github.com/lib/pq"
)

var DB *sql.DB

// ConnectDB établit une connexion à la base des données PostgreSQL
func ConnectDB() {
	var err error

	// Chaîne de connexion
	connStr := fmt.Sprintf(
		"user=%s password=%s dbname=%s host=%s port=%s sslmode=%s",
		config.Cfg.DBUser,
		config.Cfg.DBPassword,
		config.Cfg.DBName,
		config.Cfg.DBHost,
		config.Cfg.DBPort,
		config.Cfg.DBSSLMode,
	)

	// Initialisation de la connexion
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		fmt.Printf("Erreur lors de l'ouverture de la base des données: %v\n", err)
		panic(err)
	}

	// Vérifie la connexion réelle à la base des données
	if err = DB.Ping(); err != nil {
		fmt.Printf("Impossible de se connecter à la base des données: %v\n", err)
		panic(err)
	}

	fmt.Println("Connexion à la base des données réussie")
}
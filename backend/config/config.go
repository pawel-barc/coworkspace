package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBUser string
	DBPassword string
	DBName string
	DBHost string
	DBPort string
	DBSSLMode string
	JWTSecret []byte

	SMTPEmail string
	SMTPPassword string
	SMTPHost string
	SMTPPort string
}

var Cfg Config
// Gestion des données sensibles stockées dans le fichier .env
func init() {
	godotenv.Load();

	Cfg = Config{
		DBUser: getEnvOrFail("DB_USER"),
		DBPassword: getEnvOrFail("DB_PASSWORD"),
		DBName: getEnvOrFail("DB_NAME"),
		JWTSecret: []byte(getEnvOrFail("JWT_SECRET")),

		DBPort: os.Getenv("DB_PORT"),
		DBHost: os.Getenv("DB_HOST"),
		DBSSLMode: os.Getenv("DB_SSLMODE"),

		
		SMTPEmail: getEnvOrFail("SMTP_EMAIL"),
		SMTPPassword: getEnvOrFail("SMTP_PASSWORD"),
		SMTPHost: getEnvOrFail("SMTP_HOST"),
		SMTPPort: getEnvOrFail("SMTP_PORT"),

	}

	if Cfg.DBHost == "" {
		Cfg.DBHost = "localhost"
	}
	if Cfg.DBPort == "" {
		Cfg.DBPort = "5432"
	}
	if Cfg.DBSSLMode == "" {
		Cfg.DBSSLMode = "disable"
	}
}

func getEnvOrFail(key string) string {
	value := os.Getenv(key)
	if value == "" {
		panic(fmt.Sprintf("Variable environnementale %s non trouvée", key))
	}
	return value
}
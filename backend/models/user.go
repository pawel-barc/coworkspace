package models

type User struct {
	ID                uint   `json:"id"`
	Email             string `json:"email"`
	Password          string `json:"password"`
	FirstName         string `json:"first_name"`
	LastName          string `json:"last_name"`
	Role              string `json:"role"`
	Status            string `json:"status"`
	VerificationToken string `json:"verification_token"`
	EmailVerified     bool   `json:"email_verified"`
}
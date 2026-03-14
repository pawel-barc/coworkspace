package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"coworkspace/db"
	"coworkspace/models"
	"coworkspace/services"
	"coworkspace/utils"
	"coworkspace/validation"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type Response struct {
	Message string `json:"message"`
}

func Register(w http.ResponseWriter, r *http.Request) {

	var req models.User

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Format JSON invalide")
		return
	}
	defer r.Body.Close()

	if err := validation.ValidatePassword(req.Password); err != nil {
		utils.SendError(w, http.StatusBadRequest, err.Error())
		return
	}

	if err := validation.ValidateEmail(req.Email); err != nil {
		utils.SendError(w, http.StatusBadRequest, err.Error())
		return
	}

	if err := validation.ValidateFirstName(req.FirstName); err != nil {
		utils.SendError(w, http.StatusBadRequest, err.Error())
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Erreur interne du serveur")
		return
	}

	req.Password = string(hashed)

	token := uuid.New().String()

	_, err = db.DB.Exec(`
	INSERT INTO "user" (email,password,first_name, last_name, verification_token,status,role)
	VALUES ($1,$2,$3,$4, $5, 'pending','user')
	`, req.Email, req.Password, req.FirstName, req.LastName, token)

	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "Email déjà utilisé")
		return
	}

	err = services.SendVerificationEmail(req.Email, token)
	if err != nil {
		fmt.Println("SMTP ERROR:", err)
	}

	utils.SendSuccess(w, http.StatusCreated, "Utilisateur enregistré avec succès! Vérifiez votre email.")
}

func VerifyEmail(w http.ResponseWriter, r *http.Request) {

	token := r.URL.Query().Get("token")

	result, err := db.DB.Exec(`
	UPDATE "user"
	SET email_verified=true,status='active'
	WHERE verification_token=$1
	`, token)

	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Erreur serveur")
		return
	}

	rows, _ := result.RowsAffected()

	if rows == 0 {
		utils.SendError(w, http.StatusBadRequest, "Token invalide")
		return
	}

	http.Redirect(
	w,
	r,
	"http://localhost:5173/email-verified",
	http.StatusSeeOther,
)
}

func Login(w http.ResponseWriter, r *http.Request) {

	var req models.User

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Format JSON invalide")
		return
	}
	defer r.Body.Close()

	var user models.User

	err := db.DB.QueryRow(`
	SELECT id,password,role,first_name, email_verified
	FROM "user"
	WHERE email=$1
	`, req.Email).Scan(
		&user.ID,
		&user.Password,
		&user.Role,
		&user.FirstName,
		&user.EmailVerified,
	)

	if err != nil {

		utils.SendError(w, http.StatusUnauthorized, "Identifiants invalides")
		return
	}

	// Vérification du mot de passe
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)) != nil {
		utils.SendError(w, http.StatusUnauthorized, "Identifiants invalides")
		return
	}

	if !user.EmailVerified {

		utils.SendError(w, http.StatusUnauthorized, "Email non vérifié")
		return
	}

	access, _ := utils.CreateToken(user.ID, user.Role, time.Minute*15)

	refresh, _ := utils.CreateToken(user.ID, user.Role, time.Hour*24*7)

	http.SetCookie(w, &http.Cookie{
		Name: "access_token",
		Value: access,
		HttpOnly: true,
		Path: "/",
	})

	http.SetCookie(w, &http.Cookie{
		Name: "refresh_token",
		Value: refresh,
		HttpOnly: true,
		Path: "/",
	})
	data := map[string]interface{}{
		"id": user.ID,
		"role": user.Role,
		"name": user.FirstName,
	}

	utils.SendSuccessWithData(w, http.StatusOK, "Connexion réussie", data)
}

// -----RAFRAÎCHISSEMENT DU TOKEN D'ACCES-------
func RefreshToken(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		utils.SendError(w, http.StatusUnauthorized, "Aucun token trouvé")
		return
	}

	claims, err := utils.ParseToken(cookie.Value)
	if err != nil {
		utils.SendError(w, http.StatusUnauthorized, err.Error())
		return
	}

	userID := uint(claims["user_id"].(float64))
	role := claims["role"].(string)

	newAccessToken, _ := utils.CreateToken(userID, role, time.Minute*15)

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    newAccessToken,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

	utils.SendSuccess(w, http.StatusOK, "Token mis à jour avec succès")
}

// ----- DECONNEXION DE L'UTILISATEUR ------
func Logout(w http.ResponseWriter, r *http.Request) {
	// Suppression des cookies
	http.SetCookie(w, &http.Cookie{
		Name: "access_token",
		Value: "",
		Path: "/",
		HttpOnly: true,
		MaxAge: -1,
		SameSite: http.SameSiteLaxMode,
	})

	http.SetCookie(w, &http.Cookie{
		Name: "refresh_token",
		Value: "",
		Path: "/",
		HttpOnly: true,
		MaxAge: -1,
		SameSite: http.SameSiteLaxMode,
	})

	utils.SendSuccess(w, http.StatusOK, "Déconnexion réussie")
}
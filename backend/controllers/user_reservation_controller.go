package controllers

import (
	"coworkspace/dto"
	"coworkspace/middleware"
	"coworkspace/models"
	"coworkspace/repositories"
	"coworkspace/services"
	"coworkspace/utils"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

var ReservationService *services.ReservationService

// POST /reservations
func CreateReservation(w http.ResponseWriter, r *http.Request) {
    userID, ok := r.Context().Value(middleware.UserIDKey).(int)
    if !ok {
        utils.SendError(w, http.StatusUnauthorized, "Utilisateur non identifié")
        return
    }

    var input dto.CreateReservationDTO
    if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
        utils.SendError(w, http.StatusBadRequest, "Invalid request body")
        return
    }

    err := ReservationService.CreateReservation(input, userID)
    if err != nil {
        utils.SendError(w, http.StatusInternalServerError, "Impossible de créer la réservation")
        return
    }

    utils.SendSuccess(w, http.StatusCreated, "Réservation créée")
}

// GET /reservations
func GetUserReservations(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIDKey).(int)
	if !ok {
		utils.SendError(w, http.StatusUnauthorized, "ID utilisateur introuvable")
		return
	}

	reservations, err := repositories.UserReservationRepo.GetByUserID(userID)
if err != nil {
	log.Println("Erreur récupération réservations:", err)

	utils.SendError(w, http.StatusInternalServerError, "Impossible de récupérer les réservations")
	return
}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reservations)
}

// PATCH /reservations/{id}
func UpdateReservation(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	resID, err := strconv.Atoi(idStr)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "ID de réservation invalide")
		return
	}

	userID, ok := r.Context().Value(middleware.UserIDKey).(int)
	if !ok {
		utils.SendError(w, http.StatusUnauthorized, "Utilisateur non identifié")
		return
	}

	var input models.Reservation
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Corps de requête invalide")
		return
	}

	input.ID = resID
	input.UserID = userID

	err = repositories.UserReservationRepo.Update(input)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Impossible de mettre à jour la réservation")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(input)
}

// DELETE /reservations/{id}
func DeleteReservation(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	resID, err := strconv.Atoi(idStr)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "ID de réservation invalide")
		return
	}

	userID, ok := r.Context().Value(middleware.UserIDKey).(int)
	if !ok {
		utils.SendError(w, http.StatusUnauthorized, "Utilisateur non identifié")
		return
	}

	err = repositories.UserReservationRepo.Delete(resID, userID)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Impossible de supprimer la réservation")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// GET /spaces/{id}/reservations
func GetSpaceReservations(w http.ResponseWriter, r *http.Request) {
	spaceIDStr := chi.URLParam(r, "id")
	spaceID, err := strconv.Atoi(spaceIDStr)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "ID espace invalide")
		return
	}

	reservations, err := repositories.UserReservationRepo.GetBySpaceID(spaceID)
	if err != nil {
    log.Println("ERROR GET RESERVATIONS:", err)
    utils.SendError(w, http.StatusInternalServerError, "Impossible de récupérer les réservations")
    return
	}

	utils.SendSuccessWithData(w, http.StatusOK, "Reservations fetched", reservations)
}
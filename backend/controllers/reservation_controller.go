package controllers

import (
	"coworkspace/dto"
	"coworkspace/middleware"
	"coworkspace/repositories"
	"coworkspace/services"
	"coworkspace/utils"
	"encoding/json"
	"net/http"
)

var ReservationService *services.ReservationService

func CreateReservation(w http.ResponseWriter, r *http.Request) {

	var input dto.CreateReservationDTO

	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = ReservationService.CreateReservation(input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusConflict)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func GetUserReservations(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIDKey).(int)
	if !ok {
		utils.SendError(w, http.StatusUnauthorized, "User ID not found")
		return
	}

	reservations, err := repositories.ReservationRepo.GetByUserID(userID)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to fetch reservations")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reservations)
}
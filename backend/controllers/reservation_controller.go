package controllers

import (
	"coworkspace/dto"
	"coworkspace/services"
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
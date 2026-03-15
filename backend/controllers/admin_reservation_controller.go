package controllers

import (
	"coworkspace/models"
	"coworkspace/repositories"
	"coworkspace/utils"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

// GET /admin/reservations
func GetAllReservations(w http.ResponseWriter, r *http.Request) {
	reservations, err := repositories.AdminReservationRepo.GetAll()
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Impossible de récupérer les réservations")
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reservations)
}

// PATCH /admin/reservations/{id}/status
func UpdateReservationStatus(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "ID de réservation invalide")
		return
	}

	var body struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Body invalide")
		return
	}

	err = repositories.AdminReservationRepo.UpdateStatus(id, body.Status)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Impossible de mettre à jour le statut")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Statut mis à jour"})
}

// PATCH /admin/reservations/{id}
func UpdateAdminReservation(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "ID de réservation invalide")
		return
	}

	var res models.Reservation
	if err := json.NewDecoder(r.Body).Decode(&res); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Body invalide")
		return
	}

	res.ID = id
	err = repositories.AdminReservationRepo.Update(res)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Impossible de mettre à jour la réservation")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}

// DELETE /admin/reservations/{id}
func DeleteAdminReservation(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "ID de réservation invalide")
		return
	}

	err = repositories.AdminReservationRepo.Delete(id)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Impossible de supprimer la réservation")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Réservation supprimée"})
}
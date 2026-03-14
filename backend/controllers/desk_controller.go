package controllers

import (
	"coworkspace/models"
	"coworkspace/repositories"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func CreateDesk(w http.ResponseWriter, r *http.Request) {

	var d models.Desk

	if err := json.NewDecoder(r.Body).Decode(&d); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := repositories.DeskRepo.Create(d); err != nil {
		http.Error(w, "Failed to create desk", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(d)
}

func GetAllDesks(w http.ResponseWriter, r *http.Request) {

	desks, err := repositories.DeskRepo.GetAll()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(desks)
}

func GetDeskByID(w http.ResponseWriter, r *http.Request) {

	id, _ := strconv.Atoi(chi.URLParam(r, "id"))

	desk, err := repositories.DeskRepo.GetByID(id)

	if err != nil {
		http.Error(w, "Desk not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(desk)
}

func UpdateDesk(w http.ResponseWriter, r *http.Request) {

	id, _ := strconv.Atoi(chi.URLParam(r, "id"))

	var d models.Desk

	if err := json.NewDecoder(r.Body).Decode(&d); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	d.ID = id

	if err := repositories.DeskRepo.Update(d); err != nil {
		http.Error(w, "Failed to update desk", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(d)
}

func DeleteDesk(w http.ResponseWriter, r *http.Request) {

	id, _ := strconv.Atoi(chi.URLParam(r, "id"))

	if err := repositories.DeskRepo.Delete(id); err != nil {
		http.Error(w, "Failed to delete desk", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
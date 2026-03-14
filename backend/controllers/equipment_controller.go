package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"coworkspace/models"
	"coworkspace/repositories"

	"github.com/go-chi/chi/v5"
)

func CreateEquipment(w http.ResponseWriter, r *http.Request) {
    var e models.Equipment
    if err := json.NewDecoder(r.Body).Decode(&e); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    if err := repositories.EquipmentRepo.Create(e); err != nil {
        http.Error(w, "Failed to create equipment", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(e)
}

func GetAllEquipment(w http.ResponseWriter, r *http.Request) {
    equipments, err := repositories.EquipmentRepo.GetAll()
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    json.NewEncoder(w).Encode(equipments)
}

func GetEquipmentByID(w http.ResponseWriter, r *http.Request) {
    id, _ := strconv.Atoi(chi.URLParam(r, "id"))
    e, err := repositories.EquipmentRepo.GetByID(id)
    if err != nil {
        http.Error(w, "Equipment not found", http.StatusNotFound)
        return
    }
    json.NewEncoder(w).Encode(e)
}

func UpdateEquipment(w http.ResponseWriter, r *http.Request) {
    id, _ := strconv.Atoi(chi.URLParam(r, "id"))
    var e models.Equipment
    if err := json.NewDecoder(r.Body).Decode(&e); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    e.ID = id
    if err := repositories.EquipmentRepo.Update(e); err != nil {
        http.Error(w, "Failed to update equipment", http.StatusInternalServerError)
        return
    }
    json.NewEncoder(w).Encode(e)
}

func DeleteEquipment(w http.ResponseWriter, r *http.Request) {
    id, _ := strconv.Atoi(chi.URLParam(r, "id"))
    if err := repositories.EquipmentRepo.Delete(id); err != nil {
        http.Error(w, "Failed to delete equipment", http.StatusInternalServerError)
        return
    }
    w.WriteHeader(http.StatusNoContent)
}

func GetEquipmentBySpace(w http.ResponseWriter, r *http.Request) {

	spaceIDStr := chi.URLParam(r, "id")

	spaceID, err := strconv.Atoi(spaceIDStr)
	if err != nil {
		http.Error(w, "Invalid space ID", http.StatusBadRequest)
		return
	}

	equipments, err := repositories.EquipmentRepo.GetBySpaceID(spaceID)
	if err != nil {
		http.Error(w, "Failed to fetch equipment", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(equipments)
}
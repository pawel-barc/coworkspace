package controllers

import (
	"coworkspace/dto"
	"coworkspace/models"
	"coworkspace/repositories"
	"coworkspace/utils"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func CreateSpace(w http.ResponseWriter, r *http.Request) {

	var req dto.CreateSpaceRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	space := models.Space{
		Name:          req.Name,
		Type:          req.Type,
		Capacity:      req.Capacity,
		LocationLabel: req.LocationLabel,
		PlanImage:     req.PlanImage,
		IsActive:      true,
	}

	err = repositories.SpaceRepo.Create(&space)
	if err != nil {
		http.Error(w, "Failed to create space", http.StatusInternalServerError)
		return
	}

	if space.Type == "open_space" {

		err := repositories.DeskRepo.GenerateForOpenSpace(
			space.ID,
			space.Capacity,
		)

		if err != nil {
			utils.SendError(w, http.StatusInternalServerError, "Failed to generate desks")
			return
		}
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(space)
}


func GetSpaces(w http.ResponseWriter, r *http.Request) {

	spaces, err := repositories.SpaceRepo.GetActive()
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to fetch spaces")
		return
	}

	utils.SendSuccessWithData(w, http.StatusOK, "Récuperation ok", spaces)
}

func GetAdminSpaces(w http.ResponseWriter, r *http.Request) {

	spaces, err := repositories.SpaceRepo.GetAll()
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to fetch spaces")
		return
	}

	utils.SendSuccessWithData(w, http.StatusOK, "Récuperation ok", spaces)
}


func GetSpaceByID(w http.ResponseWriter, r *http.Request) {
    idStr := chi.URLParam(r, "id")  
    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "Invalid space ID", http.StatusBadRequest)
        return
    }

    space, err := repositories.SpaceRepo.GetByID(id)
    if err != nil {
        http.Error(w, "Space not found", http.StatusNotFound)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(space)
}


func UpdateSpace(w http.ResponseWriter, r *http.Request) {
    idStr := chi.URLParam(r, "id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "Invalid space ID", http.StatusBadRequest)
        return
    }

    var input models.Space
    if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
        http.Error(w, "Invalid JSON body", http.StatusBadRequest)
        return
    }

    input.ID = id

    if err := repositories.SpaceRepo.Update(input); err != nil {
        http.Error(w, "Failed to update space", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(input)
}


func DeleteSpace(w http.ResponseWriter, r *http.Request) {
    idStr := chi.URLParam(r, "id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "Invalid space ID", http.StatusBadRequest)
        return
    }

    if err := repositories.SpaceRepo.Delete(id); err != nil {
        http.Error(w, "Failed to delete space", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusNoContent) // 204 No Content
}


func GetFullSpace(w http.ResponseWriter, r *http.Request) {

    idStr := chi.URLParam(r, "id")

    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "Invalid space ID", http.StatusBadRequest)
        return
    }

    result, err := repositories.SpaceRepo.GetFullSpace(id)
    if err != nil {
        http.Error(w, "Space not found", http.StatusNotFound)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(result)
}


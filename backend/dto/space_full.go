package dto

import "coworkspace/models"

type SpaceFullResponse struct {
    Space      models.Space       `json:"space"`
    Desks      []models.Desk      `json:"desks"`
    Equipments []models.Equipment `json:"equipments"`
}
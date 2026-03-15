package services

import (
	"coworkspace/dto"
	"coworkspace/repositories"
	"errors"
)

type ReservationService struct {
	Repo *repositories.UserReservationRepository
}

func (s *ReservationService) CreateReservation(dto dto.CreateReservationDTO) error {
	if s.Repo == nil {
		return errors.New("reservation repository not initialized")
	}

	conflict, err := s.Repo.HasConflict(dto.DeskID, dto.SpaceID, dto.StartAt, dto.EndAt)
	if err != nil {
		return err
	}

	if conflict {
		return errors.New("reservation conflict")
	}

	return s.Repo.Create(dto)
}
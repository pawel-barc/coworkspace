package services

import (
	"coworkspace/dto"
	"coworkspace/repositories"
	"errors"
)

type ReservationService struct {
	Repo *repositories.UserReservationRepository
}

func (s *ReservationService) CreateReservation(input dto.CreateReservationDTO, userID int) error {
    input.UserID = userID
    if s.Repo == nil {
        return errors.New("reservation repository not initialized")
    }

    conflict, err := s.Repo.HasConflict(input.DeskID, input.SpaceID, input.StartAt, input.EndAt)
    if err != nil {
        return err
    }

    if conflict {
        return errors.New("reservation conflict")
    }

    return s.Repo.Create(input)
}
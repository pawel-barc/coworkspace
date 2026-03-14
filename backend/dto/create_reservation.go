package dto

import "time"

type CreateReservationDTO struct {
	UserID     int       `json:"user_id"`
	SpaceID    *int      `json:"space_id,omitempty"`
	DeskID     *int      `json:"desk_id,omitempty"`
	StartAt    time.Time `json:"start_at"`
	EndAt      time.Time `json:"end_at"`
	Title      string    `json:"title"`
	Notes      string    `json:"notes"`
	Visibility string    `json:"visibility"`
}
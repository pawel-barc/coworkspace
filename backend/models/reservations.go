package models

import "time"

type Reservation struct {
	ID         int        `json:"id"`
	UserID     int        `json:"user_id"`
	SpaceID    *int       `json:"space_id,omitempty"` // Nullable, optional
	DeskID     *int       `json:"desk_id,omitempty"`  // Nullable, optional
	StartAt    time.Time  `json:"start_at"`
	EndAt      time.Time  `json:"end_at"`
	Status     string     `json:"status"`
	Visibility string     `json:"visibility"`
	Title      string     `json:"title"`
	Notes      *string     `json:"notes"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
}
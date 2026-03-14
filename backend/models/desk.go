package models

import "time"

type Desk struct {
	ID        int       `json:"id"`
	SpaceID   int       `json:"space_id"`
	Name      string    `json:"name"`
	PositionX int       `json:"position_x"`
	PositionY int       `json:"position_y"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
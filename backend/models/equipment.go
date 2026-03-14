package models

import "time"

type Equipment struct {
    ID          int       `json:"id"`
    Name        string    `json:"name"`
    Quantity    int       `json:"quantity"`
    SpaceID     int       `json:"space_id"`
    Description string    `json:"description,omitempty"`
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`
}
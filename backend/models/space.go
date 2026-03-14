package models

import "time"

type Space struct {
	ID            int       `json:"id"`
	Name          string    `json:"name"`
	Type          string    `json:"type"`
	Capacity      int       `json:"capacity"`
	LocationLabel string    `json:"location_label"`
	PlanImage     string    `json:"plan_image"`
	IsActive      bool      `json:"is_active"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
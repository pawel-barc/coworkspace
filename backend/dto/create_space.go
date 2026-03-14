package dto

type CreateSpaceRequest struct {
	Name          string `json:"name"`
	Type          string `json:"type"`
	Capacity      int    `json:"capacity"`
	LocationLabel string `json:"location_label"`
	PlanImage     string `json:"plan_image"`
}
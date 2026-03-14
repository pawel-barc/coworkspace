package repositories

import (
	"coworkspace/dto"
	"database/sql"
	"time"
)

type ReservationRepository struct {
	DB *sql.DB
}

func (r *ReservationRepository) HasConflict(
	deskID *int,
	spaceID *int,
	start time.Time,
	end time.Time,
) (bool, error) {

	query := `
	SELECT COUNT(*)
	FROM reservation
	WHERE status != 'cancelled'
	AND (
		(desk_id = $1 AND $1 IS NOT NULL)
		OR
		(space_id = $2 AND $2 IS NOT NULL)
	)
	AND start_at < $3
	AND end_at > $4
	`

	var count int
	err := r.DB.QueryRow(query, deskID, spaceID, end, start).Scan(&count)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *ReservationRepository) Create(dto dto.CreateReservationDTO) error {
	query := `
	INSERT INTO reservation
	(user_id, space_id, desk_id, start_at, end_at, title, notes, visibility)
	VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
	`

	_, err := r.DB.Exec(
		query,
		dto.UserID,
		dto.SpaceID,
		dto.DeskID,
		dto.StartAt,
		dto.EndAt,
		dto.Title,
		dto.Notes,
		dto.Visibility,
	)

	return err
}
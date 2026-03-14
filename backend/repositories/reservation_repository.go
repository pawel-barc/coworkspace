package repositories

import (
	"coworkspace/dto"
	"coworkspace/models"
	"database/sql"
	"errors"
	"time"
)

type ReservationRepository struct {
	DB *sql.DB
}

var ReservationRepo *ReservationRepository

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

func (r *ReservationRepository) GetByUserID(userID int) ([]models.Reservation, error) {
	rows, err := r.DB.Query(`
		SELECT id, user_id, space_id, desk_id, start_at, end_at, status, visibility, title, notes, created_at, updated_at
		FROM reservation
		WHERE user_id = $1
		ORDER BY start_at ASC
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reservations []models.Reservation
	for rows.Next() {
		var res models.Reservation
		err := rows.Scan(
			&res.ID, &res.UserID, &res.SpaceID, &res.DeskID, &res.StartAt, &res.EndAt,
			&res.Status, &res.Visibility, &res.Title, &res.Notes,
			&res.CreatedAt, &res.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		reservations = append(reservations, res)
	}

	return reservations, nil
}

func (repo *ReservationRepository) Update(res models.Reservation) error {
	result, err := repo.DB.Exec(`
		UPDATE reservation
		SET start_at=$1, end_at=$2, title=$3, notes=$4, visibility=$5, updated_at=NOW()
		WHERE id=$6 AND user_id=$7
	`, res.StartAt, res.EndAt, res.Title, res.Notes, res.Visibility, res.ID, res.UserID)
	if err != nil {
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return errors.New("Reservation non trouvée ou non autorisée")
	}

	return nil
}

func (repo *ReservationRepository) Delete(resID int, userID int) error {
	result, err := repo.DB.Exec(`
		DELETE FROM reservation
		WHERE id=$1 AND user_id=$2
	`, resID, userID)
	if err != nil {
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return errors.New("Reservation non trouvée ou non autorisée")
	}

	return nil
}
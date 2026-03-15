package repositories

import (
	"coworkspace/models"
	"database/sql"
)

// Repo pour les réservations côté admin
type AdminReservationRepository struct {
	DB *sql.DB
}

// Instance globale
var AdminReservationRepo *AdminReservationRepository

// Récupère toutes les réservations
func (r *AdminReservationRepository) GetAll() ([]models.Reservation, error) {
	rows, err := r.DB.Query(`
		SELECT id, user_id, space_id, desk_id, start_at, end_at, status, visibility, title, notes, created_at, updated_at
		FROM reservation
		ORDER BY start_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	reservations := []models.Reservation{}
	for rows.Next() {
		var res models.Reservation
		err := rows.Scan(
			&res.ID, &res.UserID, &res.SpaceID, &res.DeskID,
			&res.StartAt, &res.EndAt, &res.Status, &res.Visibility,
			&res.Title, &res.Notes, &res.CreatedAt, &res.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		reservations = append(reservations, res)
	}
	return reservations, nil
}

// Met à jour le statut d'une réservation (admin)
func (r *AdminReservationRepository) UpdateStatus(reservationID int, status string) error {
	_, err := r.DB.Exec(`UPDATE reservation SET status=$1, updated_at=NOW() WHERE id=$2`, status, reservationID)
	return err
}

// Met à jour toutes les informations modifiables d'une réservation (admin)
func (r *AdminReservationRepository) Update(res models.Reservation) error {
	_, err := r.DB.Exec(`
		UPDATE reservation
		SET start_at=$1, end_at=$2, visibility=$3, title=$4, notes=$5, updated_at=NOW()
		WHERE id=$6
	`,
		res.StartAt, res.EndAt, res.Visibility, res.Title, res.Notes, res.ID,
	)
	return err
}

// Supprime une réservation par ID (admin)
func (r *AdminReservationRepository) Delete(reservationID int) error {
	_, err := r.DB.Exec(`DELETE FROM reservation WHERE id=$1`, reservationID)
	return err
}
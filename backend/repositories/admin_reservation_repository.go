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

// Récupère toutes les réservations avec nom d'utilisateur et nom de salle
func (r *AdminReservationRepository) GetAll() ([]map[string]interface{}, error) {
	rows, err := r.DB.Query(`
		SELECT 
			res.id, res.user_id, u.first_name, u.last_name,
			res.space_id, s.name as space_name,
			res.desk_id, res.start_at, res.end_at, 
			res.status, res.visibility, res.title, res.notes, 
			res.created_at, res.updated_at
		FROM reservation res
		LEFT JOIN "user" u ON res.user_id = u.id
		LEFT JOIN space s ON res.space_id = s.id
		ORDER BY res.start_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	reservations := []map[string]interface{}{}

	for rows.Next() {
		// Deklaracja zmiennych dla Scan
		var (
			id, userID, spaceID, deskID sql.NullInt64
			firstName, lastName          sql.NullString
			spaceName                    sql.NullString
			startAt, endAt               sql.NullTime
			status, visibility, title    sql.NullString
			notes                        sql.NullString
			createdAt, updatedAt         sql.NullTime
		)

		err := rows.Scan(
			&id, &userID, &firstName, &lastName,
			&spaceID, &spaceName,
			&deskID, &startAt, &endAt,
			&status, &visibility, &title, &notes,
			&createdAt, &updatedAt,
		)
		if err != nil {
			return nil, err
		}

		// Łączenie imienia i nazwiska
		userFullName := ""
		if firstName.Valid || lastName.Valid {
			userFullName = firstName.String + " " + lastName.String
		}

		res := map[string]interface{}{
			"id":         id.Int64,
			"user_id":    userID.Int64,
			"user_name":  userFullName,
			"space_id":   nilIfInvalid(spaceID),
			"space_name": spaceName.String,
			"desk_id":    nilIfInvalid(deskID),
			"start_at":   nilIfInvalidTime(startAt),
			"end_at":     nilIfInvalidTime(endAt),
			"status":     status.String,
			"visibility": visibility.String,
			"title":      title.String,
			"notes":      notes.String,
			"created_at": createdAt.Time,
			"updated_at": updatedAt.Time,
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

// Pomocnicze funkcje dla wartości NULL
func nilIfInvalid(val sql.NullInt64) interface{} {
	if val.Valid {
		v := int(val.Int64)
		return &v
	}
	return nil
}

func nilIfInvalidTime(val sql.NullTime) interface{} {
	if val.Valid {
		return val.Time
	}
	return nil
}
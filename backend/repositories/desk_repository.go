package repositories

import (
	"coworkspace/models"
	"database/sql"
	"fmt"
)

type DeskRepository struct {
	DB *sql.DB
}

var DeskRepo *DeskRepository

func (r *DeskRepository) Create(d models.Desk) error {

	query := `
	INSERT INTO desk (space_id, name, position_x, position_y, is_active)
	VALUES ($1,$2,$3,$4,$5)
	RETURNING id
	`

	return r.DB.QueryRow(
		query,
		d.SpaceID,
		d.Name,
		d.PositionX,
		d.PositionY,
		d.IsActive,
	).Scan(&d.ID)
}


func (r *DeskRepository) GetAll() ([]models.Desk, error) {

	rows, err := r.DB.Query(`
	SELECT id, space_id, name, position_x, position_y, is_active, created_at, updated_at
	FROM desk
	ORDER BY id ASC
	`)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var desks []models.Desk

	for rows.Next() {

		var d models.Desk

		err := rows.Scan(
			&d.ID,
			&d.SpaceID,
			&d.Name,
			&d.PositionX,
			&d.PositionY,
			&d.IsActive,
			&d.CreatedAt,
			&d.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		desks = append(desks, d)
	}

	return desks, nil
}

func (r *DeskRepository) GetByID(id int) (*models.Desk, error) {

	var d models.Desk

	err := r.DB.QueryRow(`
	SELECT id, space_id, name, position_x, position_y, is_active, created_at, updated_at
	FROM desk
	WHERE id=$1
	`, id).Scan(
		&d.ID,
		&d.SpaceID,
		&d.Name,
		&d.PositionX,
		&d.PositionY,
		&d.IsActive,
		&d.CreatedAt,
		&d.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &d, nil
}

func (r *DeskRepository) GetBySpaceID(spaceID int) ([]models.Desk, error) {

	rows, err := r.DB.Query(`
	SELECT id, space_id, name, position_x, position_y, is_active, created_at, updated_at
	FROM desk
	WHERE space_id=$1
	ORDER BY id ASC
	`, spaceID)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var desks []models.Desk

	for rows.Next() {

		var d models.Desk

		err := rows.Scan(
			&d.ID,
			&d.SpaceID,
			&d.Name,
			&d.PositionX,
			&d.PositionY,
			&d.IsActive,
			&d.CreatedAt,
			&d.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		desks = append(desks, d)
	}

	return desks, nil
}


func (r *DeskRepository) Update(d models.Desk) error {

	_, err := r.DB.Exec(`
	UPDATE desk
	SET name=$1,
	    position_x=$2,
	    position_y=$3,
	    is_active=$4,
	    updated_at=NOW()
	WHERE id=$5
	`,
		d.Name,
		d.PositionX,
		d.PositionY,
		d.IsActive,
		d.ID,
	)

	return err
}

func (r *DeskRepository) Delete(id int) error {

	_, err := r.DB.Exec(`
	DELETE FROM desk
	WHERE id=$1
	`, id)

	return err
}


func (r *DeskRepository) GenerateForOpenSpace(spaceID int, capacity int) error {

	for i := 1; i <= capacity; i++ {

		d := models.Desk{
			SpaceID:   spaceID,
			Name:      fmt.Sprintf("Desk %d", i),
			PositionX: (i % 10) * 60,
			PositionY: (i / 10) * 60,
			IsActive:  true,
		}

		err := r.Create(d)

		if err != nil {
			return err
		}
	}

	return nil
}